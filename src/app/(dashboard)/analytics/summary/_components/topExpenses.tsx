import CategoriesBreakdown from './categoriesBreakdown';
import cn from 'classnames';

type Props = {};

export default function TopExpenses({}: Props) {
  return (
    <div className="space-y-7">
      <div className="p-[1px] bg-top-expenses-border rounded-[32px]">
        <div className="text-white space-y-4 bg-[#8D2A7B] rounded-[32px] p-6">
          {/* bar chart */}
          <div className="flex items-end justify-center space-x-6">
            <Bar
              label="Housing"
              amount="₦250,000"
              percentage={80}
              color="bg-top-expenses-bar1"
            />
            <Bar
              label="Food"
              amount="₦250,000"
              percentage={60}
              color="bg-top-expenses-bar2"
            />
            <Bar
              label="Transport"
              amount="₦250,000"
              percentage={70}
              color="bg-top-expenses-bar3"
            />
          </div>
          <h6 className="text-xl font-bold space-y-4">Come on you Stunner!🎉🥳👏🏽</h6>
          <p>
            You spent more on your housing expenses this month, however it is way above
            budget.
          </p>
        </div>
      </div>
      <CategoriesBreakdown title="Top Expenses Breakdown" buttonColor="bg-[#C16CB2]" />
    </div>
  );
}

type BarProps = {
  label: string;
  amount: string;
  percentage: number;
  color: string;
};

const Bar = ({ label, amount, percentage, color }: BarProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-10 h-[180px] bg-[#7C146A] rounded-[10px] overflow-hidden">
        <div
          className={cn(
            'absolute bottom-0 w-full rounded-[10px] border-[0.24px] border-[#ffffffa1]',
            color,
          )}
          style={{
            height: `${percentage}%`,
          }}
        />
        <div className="absolute left-0 right-0 bottom-8 h-fit flex justify-center items-center font-bold text-white rotate-[-90deg]">
          {amount}
        </div>
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
