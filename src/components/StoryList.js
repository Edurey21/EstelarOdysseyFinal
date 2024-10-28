import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './StoryList.css';

const StoryList = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchTopStories = async () => {
      const { data, error } = await supabase
        .from('Templates')
        .select('id, storyTitle, description, Collaborations (id)');

      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }

      if (data) {
        const storiesWithCollaborators = data.map(story => ({
          id: story.id,
          storyTitle: story.storyTitle,
          description: story.description,
          collaboratorCount: story.Collaborations.length
        }));

        const sortedStories = storiesWithCollaborators
          .sort((a, b) => b.collaboratorCount - a.collaboratorCount)
          .slice(0, 3);

        setStories(sortedStories);
      }
    };

    fetchTopStories();
  }, []);

  return (
    <div className="story-list">
      <h3>Historias Destacadas</h3>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <h4>{story.storyTitle}</h4>
            <p>{story.description}</p>
            <p><strong>Colaboradores:</strong> {story.collaboratorCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
