import React from 'react';

type Props = {};

export default function SpendingTrends({}: Props) {
  return (
    <div>
      <div className="space-y-7">
        {/* TODO: chart */}

        <div className="text-white space-y-4">
          <h6 className="text-xl font-bold space-y-4">Big Spender Purr 😊👏🏽</h6>
          <p>
            Here’s how spending went over the week. Seems like Wednesday was pretty
            eventful.
          </p>
        </div>
      </div>
    </div>
  );
}
