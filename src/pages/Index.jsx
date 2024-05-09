import { Box, Button, Container, Flex, Heading, IconButton, Link, List, ListItem, Text, VStack } from "@chakra-ui/react";
import { FaSync } from "react-icons/fa";
import { useEffect, useState } from "react";

const fetchHackerNewsPosts = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 30).map(async (id) => {
      const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyResp.json();
    }),
  );
  return stories;
};

const Header = ({ onRefresh }) => {
  return (
    <Flex bg="teal.500" p={4} color="white" justifyContent="space-between" alignItems="center" width="full">
      <Heading size="lg">HackerNews Trending</Heading>
      <IconButton icon={<FaSync />} aria-label="Refresh Posts" onClick={onRefresh} />
    </Flex>
  );
};

const PostItem = ({ title, score, by, url }) => {
  return (
    <ListItem borderBottom="1px" borderColor="gray.200" p={4}>
      <Link href={url} isExternal>
        <Text fontWeight="bold">{title}</Text>
      </Link>
      <Text fontSize="sm">
        Score: {score} - By: {by}
      </Text>
    </ListItem>
  );
};

const PostList = ({ posts }) => {
  return (
    <List spacing={3} overflowY="auto" p={2} flex="1">
      {posts.map((post) => (
        <PostItem key={post.id} title={post.title} score={post.score} by={post.by} url={post.url} />
      ))}
    </List>
  );
};

const Index = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchHackerNewsPosts().then(setPosts);
  }, []);

  const refreshPosts = () => {
    fetchHackerNewsPosts().then(setPosts);
  };

  return (
    <Container maxW="container.md" height="100vh" p={0}>
      <VStack spacing={0} height="full">
        <Header onRefresh={refreshPosts} />
        <PostList posts={posts} />
      </VStack>
    </Container>
  );
};

export default Index;
