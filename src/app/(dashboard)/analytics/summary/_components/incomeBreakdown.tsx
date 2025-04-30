import React from 'react';

type Props = {};

export default function IncomeBreakdown({}: Props) {
  return (
    <div>
      <div className="space-y-7">
        {/* chart */}

        <div className="text-white space-y-4">
          <h6 className="text-xl font-bold space-y-4">Good one mate! 😊👏🏽</h6>
          <p>
            This is the breakdown of your income this week. Your Salary still tops the
            list, but with a few more side gigs, you can have a lot more for Savings &
            Investments.
          </p>
        </div>
      </div>
    </div>
  );
}
