import { gql } from 'apollo-boost'

export const ALL_POSTS = gql`
  query{
    allPosts{
      title
      user{
        username
        _id
      }
      skillNames{
        name
      }
      skillCapacities
      skillFills
      time
      description
      color
      imageLinks
      referenceLinks
      _id
    }
  }
`

export const ALL_USERS = gql`
  query{
    allUsers{
      username
      email
      referenceLink
      primarySkills{
        name
      }
      secondarySkills{
        name
      }
      interests
      posts{
        _id
      }
      notifications{
        userFrom{
          _id
        }
        userTo{
          _id
        }
        message
        post{
          _id
        }
        proposedContribution
        accepted
      }
      savedPosts{
        _id
      }
      _id
    }
  }
`

export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!) {
    createUser(
      username: $username,
      password: $password
    ){
      username
      password
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(
      username: $username,
      password: $password
    ){
      value
    }
  }
`

export const ME = gql`
  query {
    me{
      username
      email
      referenceLink
      primarySkills{
        name
      }
      secondarySkills{
        name
      }
      interests
      posts{
        title
        skillCapacities
        skillFills
        _id
      },
      notifications{
        userFrom{
          _id
        }
        userTo{
          _id
        }
        message
        post{
          title
          _id
        }
        proposedContribution
        accepted
      }
      _id

    }
  }
`