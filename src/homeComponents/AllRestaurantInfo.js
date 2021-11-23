import React from "react";
import { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { Form } from "react-bootstrap"; 




const HeadingContainer = tw.div`text-center`;
const SectionHeading = tw.h2`text-4xl sm:text-5xl font-black tracking-wide text-center`;

const Heading = tw(SectionHeading)``;
const SectionDescription = tw.p`mt-4 text-sm md:text-base lg:text-lg font-medium leading-relaxed text-gray-100 max-w-xl`;

const Description = tw(SectionDescription)`mx-auto`;
const Container = tw.div`relative`;
const ContentWithPaddingXl= tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;
const Subheading = tw.h5`font-bold text-gray-500`
const Posts = tw.div`mt-12 flex flex-wrap -mr-3 relative`;

const Post = tw.a`flex flex-col h-full bg-gray-200 rounded`;
const PostImage = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-64 sm:h-80 bg-center bg-cover rounded-t`}
`;
const PostText = tw.div`flex-1 px-6 py-8` 
const PostTitle = tw.h6`font-bold group-hocus:text-gray-500 transition duration-300 `;
const PostDescription = tw.p``;
const AuthorInfo = tw.div`flex`;
const AuthorImage = tw.img`w-12 h-12 rounded-full mr-3`;
const AuthorTextInfo = tw.div`text-xs text-gray-600`;
const AuthorName = tw.div`font-semibold mt-2`;
const AuthorProfile = tw.div`pt-1 font-medium`;

const PostContainer = styled.div`
  ${tw`relative z-20 mt-10 sm:pt-3 pr-3 w-full sm:w-1/2 lg:w-1/3 max-w-sm mx-auto sm:max-w-none sm:mx-0`}

  ${props => props.featured && css`
    ${tw`w-full sm:w-full lg:w-2/3`}
    ${Post} {
      ${tw`sm:flex-row items-center sm:pr-3`}
    }
    ${PostImage} {
      ${tw`sm:h-80 sm:min-h-full w-full sm:w-1/2 rounded-t sm:rounded-t-none sm:rounded-l`}
    }
    ${PostText} {
      ${tw`pl-8 pr-5`}
    }
    ${PostTitle} {
      ${tw`text-2xl`}
    }
    ${PostDescription} {
      ${tw`mt-4 text-sm font-semibold text-gray-600 leading-relaxed`}
    }
    ${AuthorInfo} {
      ${tw`mt-8 flex items-center`}
    }
    ${AuthorName} {
      ${tw`mt-0 font-bold text-gray-700 text-sm`}
    }
  `}
`;


function AllRestaurantInfo({
  
  // subheading = "",
  heading = "All Restaurant Details",
  // description = "",
  posts = [
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "slaves",
      authorName: "Aaron Patterson",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Annapoorna",
      authorName: "Sam Phipphen",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "hotel theDot",
      authorName: "Tony Hawk",
    },
    {
      postImageSrc:
        "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Suren Mess",
      authorName: "Himali Turn",
    }
  ]
 }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeadingContainer>
          {/* {subheading && <Subheading>{subheading}</Subheading>} */}
          {heading && <Heading>{heading}</Heading>}
          <Form.Control type="text" placeholder="Search Restaurants" onChange={event => {setSearchTerm(event.target.value)}} />
          {/* {description && <Description>{description}</Description>} */}
        </HeadingContainer>
        <Posts>
          {posts.filter((post) => {
            if (searchTerm == "") {
              return post
            } else if (post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
              return post
            }
          }).map((post, index) => (
            <PostContainer key={index}>
              <Post className="group" href={post.url}>
                <PostImage imageSrc={post.postImageSrc} />
                <PostText>
                  <PostTitle>{post.title}</PostTitle>
                  {post.featured && <PostDescription>{post.description}</PostDescription>}
                  <AuthorInfo>
                    {post.featured && <AuthorImage src={post.authorImageSrc} />}
                    <AuthorTextInfo>
                      <AuthorName>{post.authorName}</AuthorName>
                      {post.featured && <AuthorProfile>{post.authorProfile}</AuthorProfile>}
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

export default AllRestaurantInfo;