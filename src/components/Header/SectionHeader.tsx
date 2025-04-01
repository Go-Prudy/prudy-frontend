'use client';

import { ReactNode, useEffect, useState } from 'react';

interface SectionHeaderProp {
  title?: string;
  customButton?: ReactNode;
}

const SectionHeader = ({ title, customButton }: SectionHeaderProp) => {
  return <div className="flex justify-between items-center"></div>;
};

export default SectionHeader;
