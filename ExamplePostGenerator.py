#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced Social Media Post Generator

This script is designed for generating a large volume of social media posts, tailored to various platforms, subjects, and audience types.

Author: Abraham Reines, Created on Thu Mar 14 21:12:19 PDT 2024, Modified: Thu Mar 14 21:12:19 PDT 2024
"""

import os
import time
import random
import logging

from concurrent.futures import ThreadPoolExecutor
from openai import OpenAI

script_dir = os.path.dirname(__file__)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class EnhancedSocialMediaPostGenerator:
    """
    Enhanced Social Media Post Generator Class
    
    Generates social media posts for different platforms, subjects, and audiences, 
    storing all posts in a single directory for easy access.
    """
    
    def __init__(self, posts_directory='ExamplePosts', total_posts=200):
        """
        Initializes the class with configurations for post generation.
        """
        self.client = OpenAI()
        self.posts_directory = os.path.join(script_dir, posts_directory)
        self.platforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Pinterest', 'Snapchat', 'TikTok']
        self.subjects = ['Technology', 'Lifestyle', 'Business', 'Education', 'Health & Wellness', 'Entertainment', 'Food', 'Travel', 'Sports']
        self.audiences = ['Personal Content Creators', 'Marketing Agencies', 'SMEs', 'Fashion Enthusiasts', 'Fitness Enthusiasts', 'Parents', 'Gamers', 'Artists', 'Book Lovers', 'Music Lovers']
        self.total_posts = total_posts

    def generate_post(self, subject, platform, audience):
        """
        Generates a social media post using the OpenAI GPT-4 API.

        Args:
            subject (str): The subject of the post.
            platform (str): The platform on which the post will be published.
            audience (str): The target audience for the post.

        Returns:
            str: The generated social media post.

        Raises:
            Exception: If there is an error generating the post.

        """
        prompt = f"""Create a {subject} post for {audience} on {platform}. 
        Ensure it is engaging and suitable for the target audience. 
        Include bracketed placeholders for any necessary details like addresses, phone numbers, store hours, etc.
        Include hashtags if applicable. 
        DO NOT INCLUDE SPECIAL CHARACTERS LIKE *. 
        Emojis are allowed."""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "system", "content": "You are a creative content generating assistant."}, 
                          {"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.75,
                top_p=0.8,
                frequency_penalty=0,
                presence_penalty=0
            )
            post = response.choices[0].message.content.strip()
            logging.info(f"Generated post for {subject} on {platform} targeting {audience}.")
            return subject, platform, audience, post
        except Exception as e:
            logging.error(f"Error generating post: {e}")
            return subject, platform, audience, None

    def save_post(self, post, subject, platform, audience):
        """
        Saves the generated post to a single directory with a descriptive filename, removing all '*' characters.

        Parameters:
        - post (str): The content of the post to be saved, with '*' characters removed.
        - subject (str): The subject of the post.
        - platform (str): The platform where the post will be published.
        - audience (str): The target audience for the post.

        Returns:
        None
        """
        if not os.path.exists(self.posts_directory):
            os.makedirs(self.posts_directory)

        # Remove all '*' characters from the post content
        post = post.replace('*', '')

        timestamp = time.strftime("%Y%m%d-%H%M%S")
        filename = f"{platform}_{subject}_{audience}_{timestamp}.txt"
        with open(os.path.join(self.posts_directory, filename), 'w') as f:
            f.write(post)
            logging.info(f"Saved post: {filename}")
            
    def generate_posts(self):
        """
        Generates a specified number of posts for various platforms, subjects, and audience types.

        This method uses a ThreadPoolExecutor to generate posts concurrently. 
        It randomly selects a subject, platform, and audience for each post and submits them to the executor. 
        Once a post is generated, it is saved using the save_post method.

        Returns:
            None
        """
        with ThreadPoolExecutor() as executor:
            futures = []
            for _ in range(self.total_posts):
                subject = random.choice(self.subjects)
                platform = random.choice(self.platforms)
                audience = random.choice(self.audiences)
                futures.append(executor.submit(self.generate_post, subject, platform, audience))

            for future in futures:
                subject, platform, audience, post = future.result()
                if post:
                    self.save_post(post, subject, platform, audience)

if __name__ == "__main__":
    enhanced_post_generator = EnhancedSocialMediaPostGenerator()
    enhanced_post_generator.generate_posts()