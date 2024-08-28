const styles = {
  border: '1px solid',
  borderImageSource:
    'linear-gradient(105.37deg, rgba(168, 88, 238, 0.6) 5.93%, rgba(251, 132, 23, 0.6) 49.81%, rgba(1, 176, 197, 0.6) 96.4%)',
  background: 'background: linear-gradient(110.4deg, #D3D2E4 19.62%, #FFFFFF 94.05%)',
};

export default function BudgetChart() {
  return (
    <div className="flex flex-col rounded-3xl overflow-hidden" style={styles}>
      <div className="px-7 bg-transparent flex justify-between items-end pt-5">
        <div className="w-[52px] rounded-t-2xl bg-[#01B0C5] h-20"></div>
        <div className="w-[52px] rounded-t-2xl bg-[#FB8417] h-8"></div>
        <div className="w-[52px] rounded-t-2xl bg-[#A858EE] h-16"></div>
      </div>

      <div className="px-[14px] py-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="font-medium text-[#060221]">N 1,245,679</div>
            <div className="text-xs text-[#A0A3BD]">Income</div>
          </div>

          <div className="text-center">
            <div className="font-medium text-[#060221]">N 1,245,679</div>
            <div className="text-xs text-[#A0A3BD]">Expenses</div>
          </div>

          <div className="text-center">
            <div className="font-medium text-[#060221]">N 1,245,679</div>
            <div className="text-xs text-[#A0A3BD]">Amount left</div>
          </div>
        </div>
      </div>
    </div>
  );
}
