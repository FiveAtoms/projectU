require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')
const Notification = require('./models/notification')
const Post = require('./models/post')
const Skill = require('./models/skill')
const { UserInputError, AuthenticationError, ApolloServer, gql } = require('apollo-server')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



// DATABASE -- FIX
const JWT_SECRET = "berySecret"
const MONGODB_URI = "mongodb+srv://FiveAtoms: admin123@cluster0-dlwek.mongodb.net/test?retryWrites=true&w=majority"


mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
    .then(console.log('Connected to MongoDB'))
    .catch(error => console.log(`Failed to establish connection: ${error}`))

const typeDefs = gql`
    type User {
        username: String!
        password: String!
        email: String!
        referenceLink: String!
        primarySkills: [Skill!]
        secondarySkills: [Skill!]
        interests: [String!]
        posts: [Post!]
        notifications: [Notification!]
        savedPosts: [Post!]
        _id: ID
    }

    type Notification {
        userFrom: User!
        userTo: User!
        message: String!
        post: Post
        proposedContribution: [Int!]
        accepted: Boolean
        _id: ID
    }

    type Post {
        title: String!
        user: User!
        skillNames: [Skill!]!
        skillCapacities: [Int!]!
        skillFills: [Int!]!
        time: String!
        description: String!
        color: String!
        imageLinks: [String!]
        referenceLinks: [String!]
        _id: ID
    }

    type Skill {
        name: String!
        uses: Int!
        _id: ID
    }

    type Token {
        value: String!
    }

    type Query {
        me: User
        searchPosts(
            filter: String!
        ): [Post!]
        allUsers: [User!]
        allPosts: [Post!]
        allSkills: [Skill!]
        allNotifications: [Notification!]
    }

    type Mutation {
        makeNotification(
            userFromId: ID!
            userToId: ID!
            message: String!
            postId: ID
            proposedContribution: [Int!]
        ): Notification
        acceptNotification(
            notificationId: ID!
        ): Notification
        declineNotification(
            notificationId: ID!
        ): Notification
        createUser(
            username: String!
            password: String!
            email: String!
            referenceLink: String!
        ): User
        addPrimarySkill(
            user: ID!
            skill: String!
        ): User
        addSecondarySkill(
            user: ID!
            skill: String!
        ):User
        addInterest(
            user: ID!
            interest: String!
        ):User
        addNotificationToUser(
            user: ID!
            notification: ID!
        ):User
        savePostToUser(
            user: ID!
            postId: ID!
        ): User
        login(
            username: String!
            password: String!
        ): Token
        addPost(
            title: String!
            user: ID!
            skillNames: [String!]!
            skillCapacities: [Int!]!
            description: String!
            color: String!
            imageLinks: [String!]
            referenceLinks: [String!]
        ): Post!
        deletePost(
            postId: ID!
        ): String!
        addSkill(
            name: String!
        ): Skill!
        updateSkillUse(
            name: String!
        ): Skill!

    }
`
// postsUnderSlice(
//     slice: String!
// ): [Post!]

const resolvers = {
    Query: {
        me: (root, args, context) => {
            return context.currentUser
        },
        searchPosts: async (root, args) => {
            const allPosts = await Post.find({})
            const filteredPosts = allPosts.filter(p => p.description.includes(args.filter))
            return filteredPosts
        },
        allUsers: (root, args) => {
            return User.find({}).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
        },
        allPosts: (root, args) => {
            return Post.find({}).populate(['user', 'skillNames'])
        },
        allSkills: (root, args) => {
            return Skill.find({})
        },
        allNotifications: (root, args) => {
            return Notification.find({}).populate(['userFrom', 'userTo', 'post'])
        }
        // postsUnderSlice: async (root, args) => {
        //     let postsToShow = await Post.find({}).populate(['sliceUnder', 'user'])
        //     postsToShow = postsToShow.filter(p => p.sliceUnder._id.toString() === args.slice)
        //     return postsToShow
        // }
    },
    Mutation: {
        makeNotification: async (root, args) => {
            const userFrom = await User.findById(args.userFromId)
            const userTo = await User.findById(args.userToId)
            const post = args.postId ? await Post.findById(args.postId) : null

            const newNotification = post ?
                new Notification({
                    userFrom,
                    userTo,
                    message: args.message,
                    post,
                    proposedContribution: args.proposedContribution
                })
                :
                new Notification({
                    userFrom,
                    userTo,
                    message: args.message,
                })

            await newNotification.save()
                .catch(error => console.log(error))
            await User.update({_id: args.userFromId}, {notifications: userFrom.notifications.concat(newNotification)}, {upsert: true})
            await User.update({_id: args.userToId}, {notifications: userTo.notifications.concat(newNotification)}, {upsert: true})
            
            return newNotification.populate(['userFrom', 'userTo', 'post'])
        },
        acceptNotification: async (root, args) => {
            await Notification.updateOne({_id: args.notificationId}, {accepted: true}, {upsert: true})
            const notification = await Notification.findById(args.notificationId)
            return notification.populate(['userFrom', 'userTo', 'post'])
        },
        declineNotification: async (root, args) => {
            await Notification.updateOne({_id: args.notificationId}, {accepted: false}, {upsert: true})
            const notification = await Notification.findById(args.notificationId)
            return notification.populate(['userFrom', 'userTo', 'post'])
        },
        createUser: async (root, args) => {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(args.password, saltRounds)
            const newUser = new User({
                username: args.username,
                password: hashedPassword,
                email: args.email,
                referenceLink: args.referenceLink
            })
            
            await newUser.save()
                .catch(error => {
                    throw new UserInputError(error.message, {
                        invalidArgs: args
                    })
                })
            return newUser.populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
        },
        addPrimarySkill: async (root, args) => {
            const user = await User.findById(args.user)
            let isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            if (!isSkill) {
                const newSkill = new Skill({
                    name: args.skill.toLowerCase(),
                    uses: 1
                })
                await newSkill.save()
                    .catch(error => console.log(error))
                isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            } else {
                await Skill.update({name: args.skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
            }
            await User.update({_id: args.user}, {primarySkills: user.primarySkills.concat(isSkill)}, {upsert: true})
            const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return updatedUser
        },
        addSecondarySkill: async (root, args) => {
            const user = await User.findById(args.user)
            let isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            if (!isSkill) {
                const newSkill = new Skill({
                    name: args.skill.toLowerCase(),
                    uses: 1
                })
                await newSkill.save()
                    .catch(error => console.log(error))
                isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            } else {
                await Skill.update({name: args.skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
            }
            await User.update({_id: args.user}, {secondarySkills: user.secondarySkills.concat(isSkill)}, {upsert: true})
            const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return updatedUser
        },
        addInterest: async (root, args) => {
            const user = await User.findById(args.user)
            await User.update({_id: args.user}, {interests: user.interests.concat(args.interest)}, {upsert: true})
            const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return updatedUser
        },
        savePostToUser: async (root, args) => {
            const user = await User.findById(args.user)
            const postToAdd = await Post.findById(args.postId)
            await User.updateOne({_id: args.user}, {savedPosts: user.savedPosts.concat(postToAdd)}, {upsert: true})
            const updatedUser = await User.findById(args.user)
            return updatedUser.populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            
            const correctPassword = user ? await bcrypt.compare(args.password, user.password) : false
            
            if (!user || !correctPassword) {
                throw new UserInputError('invalid credentials')
            }

            const userForToken = {
                username: user.username,
                _id: user._id
            }
            return { value: jwt.sign(userForToken, JWT_SECRET) }
        },
        addPost: async (root, args) => {
            let allSkills = []
            for (const skill of args.skillNames) {
                const isSkill = await Skill.findOne({name: skill.toLowerCase()})
                if (!isSkill) {
                    const newSkill = new Skill({
                        name: skill.toLowerCase(),
                        uses: 1
                    })
                    await newSkill.save()
                        .catch(error => console.log(error))
                    allSkills.push(newSkill)
                } else {
                    await Skill.update({name: skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
                    allSkills.push(isSkill)
                }
            }

            const user = await User.findById(args.user)

            const newPost = new Post({
                title: args.title,
                user: user,
                skillNames: allSkills,
                skillCapacities: args.skillCapacities,
                skillFills: new Array(args.skillNames.length).fill(0),
                time: new Date(),
                description: args.description,
                color: args.color,
                imageLinks: args.imageLinks,
                referenceLinks: args.referenceLinks
            })

            await User.updateOne({_id: args.user}, {posts: user.posts.concat(newPost)}, {upsert: true})

            await newPost.save()
                .catch(error => console.log(error))
            
            return newPost.populate(['user', 'skillNames'])
        },
        deletePost: async (root, args) => {
            const postToRemove = await Post.findById(args.postId).populate(['user', 'skillNames'])
            const postMaker = await User.findById(postToRemove.user._id)
            const updetedPosts = postMaker.posts.filter(id => id.toString() !== args.postId)
            await User.updateOne({_id: postMaker._id}, {posts: updetedPosts}, {upsert: true})

            await Post.deleteOne({_id: args.postId})
            return 'post successfully deleted'
        },
        addSkill: async (root, args) => {
            const newSkill = new Skill({
                name: args.name.toLowerCase(),
                uses: 1
            })

            await newSkill.save()
                .catch(error => console.log(error))

            return newSkill
        }

    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.startsWith(`${JWT_SECRET} `)) {
            const token = jwt.verify(
                auth.substring(JWT_SECRET.length + 1), JWT_SECRET)
            const currentUser = await User.findById(token._id).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return { currentUser }
        } else {
            return { currentUser: null }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})