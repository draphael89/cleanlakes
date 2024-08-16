import React from 'react';

interface AIGeneratedContentProps {
  lakeName: string;
}

const AIGeneratedContent: React.FC<AIGeneratedContentProps> = ({ lakeName }) => {
  // This is a placeholder. In the future, this component will fetch AI-generated content from an API.
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">About {lakeName}</h2>
      <p className="mb-4">
        {lakeName} is a beautiful lake located in the United States. It is known for its pristine waters and diverse ecosystem. Visitors to {lakeName} can enjoy a variety of activities, including fishing, boating, and hiking along its shores.
      </p>
      <p>
        The lake plays a crucial role in the local environment, providing habitat for numerous species of fish, birds, and other wildlife. Its water quality is closely monitored to ensure the health of the ecosystem and the safety of those who enjoy its resources.
      </p>
    </div>
  );
};

export default AIGeneratedContent;