import React, { useState } from 'react';
import ExecutionTab from './tabs/ExecutionTab';
import SpaceTimeTab from './tabs/SpaceTimeTab';
import IDChainTab from './tabs/IDChainTab';
import ComplexityTab from './tabs/ComplexityTab';
import FormalMTab from './tabs/FormalMTab';
import BuildTMTab from './tabs/BuildTMTab';

export default function DataPanel({ machineDef, activeState, logs, history, currentStepIndex, onSelectMachine }) {
  const [activeTab, setActiveTab] = useState('Execution');
  const tabs = ['Execution', 'Space-Time', 'ID Chain', 'Complexity', 'Formal M', 'Build TM'];

  return (
    <div className="w-full mt-4 flex flex-col items-center">
      <div className="flex bg-[#222] border border-[#333] rounded-full p-1 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === t 
                ? 'bg-[#333] text-white shadow-sm' 
                : 'text-[#888] hover:text-[#bbb]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="w-full bg-[#1c1c1c] rounded-xl">
        {activeTab === 'Execution' && <ExecutionTab machineDef={machineDef} activeState={activeState} logs={logs} />}
        {activeTab === 'Space-Time' && <SpaceTimeTab history={history} currentStepIndex={currentStepIndex} />}
        {activeTab === 'ID Chain' && <IDChainTab history={history} currentStepIndex={currentStepIndex} />}
        {activeTab === 'Complexity' && <ComplexityTab machineDef={machineDef} />}
        {activeTab === 'Formal M' && <FormalMTab machineDef={machineDef} />}
        {activeTab === 'Build TM' && <BuildTMTab onLoadMachine={onSelectMachine} />}
      </div>
    </div>
  );
}
