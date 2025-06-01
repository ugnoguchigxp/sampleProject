import { useState } from 'react';
import TreeMenu from '../components/TreeMenu';
import { useIsMobile } from '../hooks/useIsMobile';

const Home: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSelect = (id: string) => {
    setSelectedNode(id);
    console.log(`Selected node: ${id}`);
  };

  return (
    <div className="flex border-gray-900">
      <div className="w-1/6 border-r">
      { !isMobile  &&
        <TreeMenu onSelect={handleSelect} />
      }
       </div>
      <div className="w-5/6 p-4">
        {selectedNode ? <p>Selected Node: {selectedNode}</p> : <p>Please select a node from the menu.</p>}
      </div>
    </div>
  );
};

export default Home;