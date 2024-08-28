import FormField from '@/components/form-field';
import RightArrowIcon from '@/icons/right-arrow';

export default function CreateBudgetForm() {
  return (
    <form className="flex flex-col">
      <div className="grow flex flex-col gap-6 p-6 bg-white">
        <FormField label="Name of budget" labelFor="budget-name">
          <input type="text" name="" id="budget-name" />
        </FormField>

        <FormField label="Purpose of budget" labelFor="purpose">
          <select className="bg-transparent" name="" id="purpose"></select>
        </FormField>

        <div className="flex gap-4">
          <FormField label="Start date" labelFor="start-date">
            <input type="date" name="" id="start-date" />
          </FormField>
          <FormField label="End date" labelFor="end-date">
            <input type="date" name="" id="end-date" />
          </FormField>
        </div>

        <div className="flex gap-4">
          <FormField label="Duplicate last budget" labelFor="last-budget" direction="row">
            <input type="radio" name="duplicate" id="last-budget" />
          </FormField>
          <FormField label="Create new budget" labelFor="new-budget" direction="row">
            <input type="radio" name="duplicate" id="new-budget" />
          </FormField>
        </div>
      </div>

      <div className="p-6 border border-t-[#eff0f6]">
        <button
          type="submit"
          className="py-[14px] bg-base-black inline-flex items-center justify-center gap-2 w-full rounded-[32px]"
        >
          <span className="font-medium text-white">Continue</span>
          <RightArrowIcon className="fill-white" />
        </button>
      </div>
    </form>
  );
}
