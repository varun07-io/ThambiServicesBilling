import React from "react";
import { useState,useEffect } from "react";
import {Spinner } from "react-bootstrap";

import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { Form } from "react-bootstrap"; 
import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
import 'firebase/database'
import 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';
import './AllRestaurantInfo.css'



const HeadingContainer = tw.div`text-center`;
const SectionHeading = tw.h2`text-4xl sm:text-5xl font-black tracking-wide text-center`;

const Heading = tw(SectionHeading)``;
const SectionDescription = tw.p`mt-4 text-sm md:text-base lg:text-lg font-medium leading-relaxed text-gray-100 max-w-xl`;

const Description = tw(SectionDescription)`mx-auto`;
const Container = tw.div`relative min-h-screen`;
const ContentWithPaddingXl= tw.div`max-w-screen-xl mx-auto py-5 lg:py-5`;
const Subheading = tw.h5`font-bold text-gray-500`
const Posts = tw.div`mt-12 flex flex-wrap -mr-3 relative justify-center items-center`;

const Post = tw.a`flex flex-col h-80 bg-gray-200 rounded-3xl text-center`;
const PostImage = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-64 sm:h-80 bg-center bg-cover rounded-t`}
`;
const PostText = tw.div`flex-1 px-6 py-8 text-center` 
const PostTitle = tw.h6`font-bold group-hocus:text-gray-500 transition duration-300 `;
const PostDescription = tw.p`text-center`;
const AuthorInfo = tw.div`flex text-center`;
const AuthorImage = tw.img`w-12 h-12 rounded-full mr-3`;
const AuthorTextInfo = tw.div`text-xs text-gray-600 text-center`;
const AuthorName = tw.div`font-semibold mt-2 text-center`;
const AuthorProfile = tw.div`pt-1 font-medium text-center`;

const PostContainer = styled.div`
  ${tw`relative z-20 mt-10 sm:pt-3 pr-3 w-full sm:w-1/2 lg:w-1/3 max-w-sm mx-auto sm:max-w-none sm:mx-0`}

  ${props => props.featured && css`
    ${tw`w-full sm:w-full lg:w-2/3`}
    ${Post} {
      ${tw`sm:flex-row items-center sm:pr-3 text-center`}
    }
    ${PostImage} {
      ${tw`sm:h-80 sm:min-h-full w-full sm:w-1/2 rounded-t sm:rounded-t-none sm:rounded-l`}
    }
    ${PostText} {
      ${tw`pl-8 pr-5`}
    }
    
    ${PostDescription} {
      ${tw`mt-4 text-sm font-semibold text-gray-600 leading-relaxed`}
    }
    ${AuthorInfo} {
      ${tw`mt-8 flex items-center`}
    }
    ${AuthorName} {
      ${tw`mt-0 font-bold text-gray-700 no-underline text-center`}
    }
  `}
`;





const AllRestaurantInfo = () => {

 {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setposts] = useState([]);


  const [isLoading, setisLoading] = useState(false)
  
  const getAllRestaurant = () => {
    setisLoading(true)

    let myRef =  firebase.database().ref(`/restaurants`).on('value', snapshot => {
      let temp_posts = []
      snapshot.forEach((t) => {
        temp_posts.push(t.val())
      })
      console.log(temp_posts);
      setposts(temp_posts)
      setisLoading(false)
      
    })
  }
  useEffect(() => {
    getAllRestaurant()
  }, [])

  const isLoadingSection = () => {
    if(isLoading){
      return(
        <div className="loading">
          <div></div>
          <div></div>
        </div> 
      )
    }
  }

  return (
    <Container className="allres--main">
      <ContentWithPaddingXl>
        <HeadingContainer>
          {/* {subheading && <Subheading>{subheading}</Subheading>} */}
          <p style={{textAlign:"center"}}>(search with restaurant name)</p>
          <Form.Control style={{borderRadius:"1rem"}} type="text" placeholder="Search Restaurants" onChange={event => {setSearchTerm(event.target.value)}} />
          {/* {description && <Description>{description}</Description>} */}
        </HeadingContainer>
        <Posts>
        {isLoadingSection()}
          {posts && posts.filter((post) => {
          console.log("Posts : ",post)
            if (searchTerm == "") {
              return post
            } else if (post.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return post
            }
          }).map((post, index) => (
            <PostContainer key={index} >
              <Post className="group" href={`/menuitems/${post.name.toString().replace(/\s/g, "")}`}>
                <PostImage  />
                <PostText>
                  <PostTitle style={{fontSize:"1.5rem"}}>{post.name}</PostTitle>                  
                  {post.featured && <PostDescription>{post.description}</PostDescription>}
                  <AuthorInfo>
                    {/* {post.featured && <AuthorImage src={post.authorImageSrc} />} */}
                    <AuthorTextInfo>
                      <AuthorName style={{fontSize:"1.2rem", textDecoration:"none"}}>{post.location}</AuthorName>
                      {/* {post.featured && <AuthorProfile>{post.authorProfile}</AuthorProfile>} */}
                    </AuthorTextInfo>
                  </AuthorInfo>
                </PostText>
              </Post>
            </PostContainer>
          ))}
         
        </Posts>
      </ContentWithPaddingXl>
    </Container>
    
  );
};
}

export default AllRestaurantInfo;