import FormField from '@/components/form-field';
import MoneyIcon from '@/icons/money';

const footerShadow = {
  boxShadow: '0px -4px 4px 0px #EFF0F680',
};
const recurringExpenseShadow = {
  boxShadow: '0px 20px 48px 0px #AAAAAA4A',
};

export default function CreateBudgetCategoryForm() {
  return (
    <form className="flex flex-col gap-6">
      <div className="px-6 flex flex-col gap-6">
        <FormField label="Name of category" labelFor="name">
          <input type="text" name="" id="name" placeholder="Enter name" />
        </FormField>

        <div className="p-4 rounded-[20px] bg-graySubtle border border-grayDefault flex items-center">
          <p className="text-grayCaption text-sm">Select category colour</p>
          <label className="bg-[#BEB8FF] rounded-full ms-auto w-6 h-6">
            <input type="color" name="" id="" className="sr-only" value="#BEB8FF" />
          </label>
        </div>

        <div className="p-4 rounded-[20px] bg-graySubtle border border-grayDefault flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Map income categories and amount */}
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#BEB8FF] text-center grid grid-cols-1 place-items-center">
              <MoneyIcon className="fill-white" />
            </div>
            <input
              type="text"
              name=""
              id=""
              className="grow bg-transparent"
              placeholder="Add sub category"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#BEB8FF] text-center text-white">
              +
            </div>
            <button type="button">Add another</button>
          </div>
        </div>
      </div>

      <div className="p-6 border border-t-[#eff0f6] rounded-t-3xl" style={footerShadow}>
        <button
          type="submit"
          className="py-[14px] bg-base-black inline-flex items-center justify-center gap-2 w-full rounded-[32px]"
        >
          <span className="font-medium text-white">Save</span>
        </button>
      </div>
    </form>
  );
}
