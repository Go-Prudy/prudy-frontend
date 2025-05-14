import React from 'react';
import BottomDrawer from '../BottomDrawer';
import { motion } from 'framer-motion';
import Redeemed from './redeemed';
import { Tab, Tabs } from '@nextui-org/react';
import History from './history';

interface Props {
  setShow: (i: boolean) => void;
  show: boolean;
  items: string[];
}

export default function PointsHistoryDrawer({ show, items, setShow }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[100vh] w-full max-w-[500px] z-[40] left-0 right-0 mx-auto bottom-0 fixed bg-[#1c1c1c73]"
    >
      <BottomDrawer
        label="Points History"
        back={false}
        show={show}
        close={true}
        onClose={() => setShow(false)}
      >
        <Tabs fullWidth>
          <Tab key="History" title="History" className="w-full">
            <History items={items} />
          </Tab>
          <Tab key="Redeemed" title="Redeemed" className="w-full">
            <Redeemed items={items} />
          </Tab>
        </Tabs>
      </BottomDrawer>
    </motion.div>
  );
}
