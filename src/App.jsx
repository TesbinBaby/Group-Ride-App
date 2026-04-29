import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GroupHome } from './screens/GroupHome';
import { LiveMapA } from './screens/LiveMapA';
import { PlanRide } from './screens/PlanRide';
import { Chat } from './screens/Chat';
import { TurnByTurn } from './screens/TurnByTurn';
import { Invite } from './screens/Invite';
import { Regroup } from './screens/Regroup';
import { Recap } from './screens/Recap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GroupHome />} />
        <Route path="live" element={<LiveMapA />} />
        <Route path="plan" element={<PlanRide />} />
        <Route path="chat" element={<Chat />} />
        <Route path="nav" element={<TurnByTurn />} />
        <Route path="invite" element={<Invite />} />
        <Route path="regroup" element={<Regroup />} />
        <Route path="recap" element={<Recap />} />
      </Route>
    </Routes>
  );
}

export default App;
