import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdCalendarToday } from "react-icons/md";

export default function DashboardPage() {
  return (
    <main className="flex-1 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* PageHeading */}
        <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-900 dark:text-gray-100 text-3xl font-bold tracking-tight">
              Business Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
              Here&apos;s an overview of your business performance.
            </p>
          </div>
        </div>
        {/* Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white pl-4 pr-3">
            <p className="text-sm font-medium leading-normal">Today</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4">
            <p className="text-sm font-medium leading-normal">Last 7 days</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4">
            <p className="text-sm font-medium leading-normal">This Month</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 pl-4 pr-3">
            <p className="text-sm font-medium leading-normal">Custom Range</p>
            <MdCalendarToday />
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">
              Total Revenue
            </p>
            <p className="text-gray-900 dark:text-gray-100 tracking-tight text-3xl font-bold leading-tight">
              $12,580
            </p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">
              +15% from last month
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">
              Total Bookings
            </p>
            <p className="text-gray-900 dark:text-gray-100 tracking-tight text-3xl font-bold leading-tight">
              350
            </p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">
              +10% from last month
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">
              New Bookings
            </p>
            <p className="text-gray-900 dark:text-gray-100 tracking-tight text-3xl font-bold leading-tight">
              45
            </p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">
              +20% from last month
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-normal">
              Average Rating
            </p>
            <p className="text-gray-900 dark:text-gray-100 tracking-tight text-3xl font-bold leading-tight flex items-center gap-1">
              4.8{" "}
              <span className="material-symbols-outlined text-yellow-500 text-3xl">
                star
              </span>
            </p>
            <p className="text-green-600 dark:text-green-500 text-sm font-medium leading-normal">
              +0.1 from last month
            </p>
          </div>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
            <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold leading-normal">
              Revenue Trend
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-gray-900 dark:text-gray-100 tracking-tight text-4xl font-bold leading-tight truncate">
                $5,230
              </p>
              <p className="text-green-600 dark:text-green-500 text-base font-medium leading-normal">
                +15.2%
              </p>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
              This Month
            </p>
            <div className="flex min-h-[220px] flex-1 flex-col gap-8 pt-4">
              <svg
                fill="none"
                height="100%"
                preserveAspectRatio="none"
                viewBox="-3 0 478 150"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                  fill="url(#paint0_linear_1131_5935)"
                />
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="#2b8cee"
                  strokeLinecap="round"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint0_linear_1131_5935"
                    x1={236}
                    x2={236}
                    y1={1}
                    y2={149}
                  >
                    <stop stopColor="#2b8cee" stopOpacity="0.2" />
                    <stop offset={1} stopColor="#2b8cee" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex justify-around">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                  Week 1
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                  Week 2
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                  Week 3
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                  Week 4
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
            <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold leading-normal">
              Popular Services
            </p>
            <p className="text-gray-900 dark:text-gray-100 tracking-tight text-4xl font-bold leading-tight truncate">
              150
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
              Total bookings this month
            </p>
            <div className="grid min-h-[220px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center px-2 pt-4">
              <div
                className="bg-primary/30 w-full rounded-t"
                style={{ height: "40%" }}
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                Groom
              </p>
              <div
                className="bg-primary/30 w-full rounded-t"
                style={{ height: "70%" }}
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                Bath
              </p>
              <div
                className="bg-primary w-full rounded-t"
                style={{ height: "100%" }}
              />
              <p className="text-primary text-xs font-bold leading-normal tracking-wide">
                Nails
              </p>
              <div
                className="bg-primary/30 w-full rounded-t"
                style={{ height: "60%" }}
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                Care
              </p>
              <div
                className="bg-primary/30 w-full rounded-t"
                style={{ height: "20%" }}
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-normal tracking-wide">
                Spa
              </p>
            </div>
          </div>
        </div>
        {/* Data Table / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                Upcoming Bookings
              </h3>
              <a
                className="text-primary text-sm font-medium hover:underline"
                href="#"
              >
                View all
              </a>
            </div>
            <div className="flow-root">
              <ul
                className="divide-y divide-gray-200 dark:divide-gray-700"
                role="list"
              >
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWRSMbeKh0zJq71u2ydtmZvm5Glr2fbN_QccQrKmKDv5FPjbCL89FTZJY29f0ItH6qmHpSmh1HYn4TUr2ohsg1iVknAUPwl2v1HewBHfUnYS5ak0isNY_Ytu9VQB0sXho0_-Phj4Q9kHhhT6QKVjY28rClbz2tx2a2zxQshNS_UBBow0TxfMdaENjpGET4R7r4viBSLvMAG_-0vxu0QyDAsdArSxMV9zDaeXYdRaxMAxE8hGmtnWnW87KTtN6RwsIHl2LBtadVyQbP"
                          alt="User avatar"
                        />
                        <AvatarFallback className="rounded-lg">
                          A
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Neil Sims
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        Nail Trim
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      Today, 2:00 PM
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBohUH1Sj6xqOoE2-6rMcJxWxLhC-hUpgfm87HQeglauFqoDIxG1M5ka-yxCLzIYztJnuDQY-IC31mR51HvW-1z8o_fQjsNkEu56TGqw6XKxMUJSk1kacTd9ZvfM1NqQJ-Bx33IBDdNzzStJu5Fhr3skVgs_3ijlEV3QoX_CSMzYlUIvHWk-YkY8XxXJPgF1ivEqpXO6VzZq4naiK6BxZDUXU8zOC0BtDmF5t-JrtHHZH4B7ey2UcWuxPTB4f80OOV-iFFZoYV5F9eV"
                          alt="User avatar"
                        />
                        <AvatarFallback className="rounded-lg">
                          A
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Bonnie Green
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        Full Groom
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      Today, 4:30 PM
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGZ7Y3vvzAY1K7b4BGMUoTXygUjUP5wJ8ElSF30PfIS7FWbTtZ08xVKLYanpmK5XWJ_2d2XeAjVA-clwjL1Cci1fZaEUiJCRRACuKwsE1kavjwmukncd6UWn7UxfryIOTv5C-m8wXC1NHUGGBbqenx8Q647JCW4JylmUKYcs5V1gROTN6ZKRG3EO-T5l3CSfApX3KQYZNPnvWsW5NNW0T992AbgO7u6HAX6dPC-5FIqpbOVTzr8CowNwSpfg6mQqGiBaTUFfPhnSL2"
                          alt="User avatar"
                        />
                        <AvatarFallback className="rounded-lg">
                          A
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        Michael Gough
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        Day Care
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      Tomorrow, 9:00 AM
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Recent Reviews */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                Latest Reviews
              </h3>
              <a
                className="text-primary text-sm font-medium hover:underline"
                href="#"
              >
                View all
              </a>
            </div>
            <div className="flow-root">
              <ul
                className="divide-y divide-gray-200 dark:divide-gray-700"
                role="list"
              >
                <li className="py-3 sm:py-4">
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9kbg5MiQo2z-lgmlN34k5BCABRWKT0U9pYboBes510ai3AboCFNxOHnu25dxpcfenm7nHAIhn6CR4Z8l9rOmnJEOVK1j7el-5LLvzyABvkwB2LfAzwGEZZOpgQRZQn43alvdUteOErvukwLQZMPNMst3TwFTxiPYFZ1DDhu-BCcouz4OkX_gvZRryHomlSCdb0y-LRSZELS_gPdbUkzx5o6JdCyxraDuMMtfgTyWYFB-7zFYMLBN0ovzXhMc0hSwja6PKMPK_5Tjq"
                          alt="User avatar"
                        />
                        <AvatarFallback className="rounded-lg">
                          A
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          Lana Byrd
                        </p>
                        <div className="flex items-center text-sm text-yellow-500">
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        &quot;Amazing service! My dog always comes back happy
                        and clean.&quot;
                      </p>
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmtKAr0tM-UBY8p3pUL1Yemd1uPVMg-_hz8NpmSKuZvXF2TaZaPi7KwgxaDNekPLdQY8gBBJC70-mgOWDH25PU5e8kq584fx4Tfq1LkILnTvqrP17uScqFnpSXqm6vI67iIA5toBOG9r8-9qSCfbJrBlHuCkbqbqTM4aocDSnChpeoNc22xogW8_OmZl4j-91Bxh2gDgAYQAMLUuGmmrdEJUphrow5cOiZgrD9OltZBGxbUg1Y82X5mFaW9BpyQXLcD3IB2ZRjvbdS"
                          alt="User avatar"
                        />
                        <AvatarFallback className="rounded-lg">
                          A
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          Thomes Lean
                        </p>
                        <div className="flex items-center text-sm text-yellow-500">
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base">
                            star
                          </span>
                          <span className="material-symbols-outlined text-base text-gray-300 dark:text-gray-600">
                            star
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        &quot;Great staff, but the wait was a bit long this
                        time.&quot;
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
