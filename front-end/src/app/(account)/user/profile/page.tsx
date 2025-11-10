export default function ProfilePage() {
  return (
    <main className="flex-1 bg-white dark:bg-[#1a202c] p-6 lg:p-8 rounded-xl shadow-sm">
      <div className="flex flex-col gap-6">
        <header>
          <p className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
            Personal Information
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal pt-2">
            View and edit your personal information and address.
          </p>
        </header>
        <div className="border-t dark:border-gray-700" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 text-(--text-primary)">
          <label className="flex flex-col w-full">
            <p className=" dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Full Name
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-[#101922] focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
              defaultValue="Nguyen Van A"
            />
          </label>
          <label className="flex flex-col w-full">
            <p className=" dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Email
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-[#101922] focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
              type="email"
              defaultValue="nva@email.com"
            />
          </label>
          <label className="flex flex-col w-full">
            <p className=" dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Phone Number
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-[#101922] focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
              type="tel"
              defaultValue={"0987654321"}
            />
          </label>
          <label className="flex flex-col w-full">
            <p className=" dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Address
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-[#101922] focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
              defaultValue="123 Main St, Anytown, USA"
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-[#f0f2f4] dark:bg-white/10 text-[#111418] dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-[120px] px-6">
            Cancel
          </button>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-[120px] px-6 hover:bg-primary/90">
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
