export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-6xl px-4 md:px-10 lg:px-0 flex-1">
            {/* TopNavBar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 md:px-6 lg:px-10 py-3 bg-background-light dark:bg-background-dark sticky top-0 z-10">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 text-gray-800 dark:text-white">
                  <div className="size-8 text-primary">
                    <svg
                      fill="none"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    PetCare Connect
                  </h2>
                </div>
                <label className="hidden md:flex flex-col min-w-40 h-10! max-w-64">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-gray-500 dark:text-gray-400 flex bg-white dark:bg-background-dark items-center justify-center pl-4 rounded-l-lg border border-gray-200 dark:border-gray-700 border-r-0">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      placeholder="Search"
                      defaultValue=""
                    />
                  </div>
                </label>
              </div>
              <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                <div className="hidden md:flex items-center gap-9">
                  <a
                    className="text-gray-800 dark:text-white text-sm font-medium leading-normal"
                    href="#"
                  >
                    Trang chủ
                  </a>
                  <a
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-sm font-medium leading-normal"
                    href="#"
                  >
                    Dịch vụ
                  </a>
                  <a
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-sm font-medium leading-normal"
                    href="#"
                  >
                    Blog
                  </a>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Admin Control Panel</span>
                </button>
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  data-alt="User avatar of a cute cartoon animal"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAwUY38M8DVOdWrTgBT9BPzuXSQG77dEMF3CawblUNftxmy63yPVdQgo_Eb0M_32hL8GQL5Ljsjp0fa-Rkt1bMd1hNbxVnTZcg9OWh6sWzhFgEhKJrhgjr-vyqZ4ZHOb99Gub1U_Mg_I8GCs385AsRztektJRgFoMBh2Pfj55pUdDLN2k7j2xS_JPB311fBtebowPhN_7iNOGfsESpk4l0VpDXp-PgmV7BFeDGnCc0mZfcSLS0knI0mKPjSTGZdZF1vV-zG7R4B3uT")',
                  }}
                />
              </div>
            </header>
            <main className="flex flex-col gap-10 md:gap-16 mt-5">
              {/* HeroSection */}
              <div className="@container">
                <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row items-center">
                  <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                    <div className="flex flex-col gap-2 text-left">
                      <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        Tìm kiếm dịch vụ chăm sóc tốt nhất cho thú cưng của bạn
                      </h1>
                      <h2 className="text-gray-700 dark:text-gray-300 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        Khám phá các khách sạn, spa, và phòng khám thú y uy tín
                        nhất gần bạn.
                      </h2>
                    </div>
                    <button className="flex w-fit min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-gray-900 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Khám phá ngay</span>
                    </button>
                  </div>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
                    data-alt="A happy golden retriever playing in a sunny field"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWlglEA1Ieab6grDt2mcFMEerrgWJjA2Gnli5ln4-f2crEByf2Bq7E4oDl7sPDEsDGy-EeXPcdlWjY66ZXteArmR7T9UMgXPw3lVxVi8ofENp-PqVV_Opf9uDdJ5ko_mGJPbmQqNy0Jp0cqfxfz20eACdnPCK52MaNEjp96aRUE0o5G59cvzOcUfExHPDWEscQUnJaJqz-Kf_AGAux5y9846PmOOk_F_wwwHHrtW3oruDwrurih8Y4Pt1FW75fKxtOld0FQ74J8Vul")',
                    }}
                  />
                </div>
              </div>
              {/* Featured Services Section */}
              <section>
                <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Dịch vụ nổi bật tuần này
                </h2>
                <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex items-stretch p-4 gap-4">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 min-w-60">
                      <div
                        className="w-full bg-center bg-no-repeat aspect-3/4 bg-cover rounded-t-xl flex flex-col"
                        data-alt="A small white dog being groomed"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZCl1DYb4TnONgDKqyv3OxYKAqkBHlI3gSoyu79zBNv9zQEwU0XzilFLujDvXHtzKhdepS8E4NDmz-qJThLvy4biEe0k677BZDpESsdVGsvDwuW2RSdwpbpPEyr65fEF3sH8OYmx8y8f3Th_yWk9Ny_nPfykvUohslAJlNcviNNSYAD3ov4u3LexXdkmIIqFBRiATTJNc1hn02YNtBavE_dV3E2EA1ohOINPoLN8AoeDXMu87kaxWN3aJwhHaJWlw1ouyEIDaW8Yka")',
                        }}
                      />
                      <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                        <div>
                          <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                            Tắm &amp; Cắt tỉa
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                            5.0 (212 đánh giá)
                          </p>
                        </div>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-gray-800 dark:text-white dark:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 min-w-60">
                      <div
                        className="w-full bg-center bg-no-repeat aspect-3/4 bg-cover rounded-t-xl flex flex-col"
                        data-alt="A veterinarian checking a cat's health"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCm_37K1r2OB0SrtWE4sxWqNIsxI9gPNNVZ4Vmq0jQjOcOY65b02kCCTirY-KF5a9wcLDGQKzTHyXlCc2SgMQkwxu8hU8BJjDg4LLXL597OlSEfdzAfMksr-o90-0ZZsME-H6nqoosfaLl6V1UHGTfhOIVAAyf0ZA8SSq2dCvFldkLrsgQU35wkCFERAdY6rXblb3VdRO3jqqBo1ZKp0DGEULKNcigXpAgCWrc60SO1rjTVR5R2MyjEBTxCUPU6xjTX9vav-4c6x4vv")',
                        }}
                      />
                      <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                        <div>
                          <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                            Khám sức khỏe tổng quát
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                            4.9 (189 đánh giá)
                          </p>
                        </div>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-gray-800 dark:text-white dark:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 min-w-60">
                      <div
                        className="w-full bg-center bg-no-repeat aspect-3/4 bg-cover rounded-t-xl flex flex-col"
                        data-alt="Two dogs playing in a pet hotel"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmWz5r40VjZIvlISZdI4E145PQBSWZRkm6YrjMBCOxesSYymowl8l0AI0piQeAB0n9iCBSsjZ1gY2NRQa_2DBzBY7FdCyuMUd02rBIfjh2DYSjhhF_jp2tDuy4ZGaeLMVMe-rGn1QLP17inmcIzBQ5BGUjlYkOHkVDWUwyYfGNQsHPYFlqYaEKjhlMuk34dBhVmfoLhhUERIHLI3OnF_htq8ZWXbtBgEEhNCgxtCP4EoMbKwStn-xV35bjPDhcCWtxTtHkNEnsLS6I")',
                        }}
                      />
                      <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                        <div>
                          <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                            Trông giữ cuối tuần
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                            4.8 (155 đánh giá)
                          </p>
                        </div>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-gray-800 dark:text-white dark:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 min-w-60">
                      <div
                        className="w-full bg-center bg-no-repeat aspect-3/4 bg-cover rounded-t-xl flex flex-col"
                        data-alt="A veterinarian giving a vaccine to a puppy"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYI05bN7koB9PRLj7g-5u5yJgTLGH00i4KdOUWUjddd6Mxze4ST42s-WJxShIDIfunGHxshUPuAFc2BjqmkO6aduHzxeuZPBw0SzKM7lrAIlDsNsko1br53e6pKduSiB-ahFwwCKOoshwPcDpCwxF4HcNXvOdlyJ5vIz_lRwmQcTpSBuBd1D3hYc39xOhPqeWrMIMZ4UiSKq26FF5gtuUUwzvqJzWinN3XEjIg8sh_KqqMuHM6t-EiRAhCvxh2Jqefb5EVxgAAarLb")',
                        }}
                      />
                      <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                        <div>
                          <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                            Tiêm phòng định kỳ
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                            5.0 (301 đánh giá)
                          </p>
                        </div>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-gray-800 dark:text-white dark:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Promotion Section */}
              <section>
                <div className="@container">
                  <div className="px-4 py-3">
                    <div
                      className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[218px]"
                      data-alt="Promotional banner showing a cat and dog with discount information"
                      style={{
                        backgroundImage:
                          'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2o2RMFTZh3yAHgL02gdktF2JuabqpBzJiuhGbODzLkW9MTRYNIQOHjv4J7VIvZDbWXUEtEPBhoFYYHMgqmzwzXRH435BcRJsbSyg6uFUTW8MuOLUOLZWTT7fsLYyijE9wiC45lcpFQ0KEbE0d5dQijVIOxzLYKTPwzwZphDL7w7YWjM_8zi0P0NUYEGhL55GshUmG66MgQzQx32l23zKPi2oocVhCrEeXz5QXlqj2xa-fAhKIrZtj3tJhU2xg6kBXEcLW9nEkENaq")',
                      }}
                    >
                      <div className="flex p-6">
                        <p className="text-white tracking-light text-[28px] font-bold leading-tight">
                          Ưu đãi không thể bỏ lỡ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Service Categories */}
              <section>
                <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Bạn đang tìm gì?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                  <a
                    className="group flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    href="#"
                  >
                    <div className="flex items-center justify-center size-16 bg-primary/20 rounded-full text-primary">
                      <span className="material-symbols-outlined text-4xl!">
                        health_and_safety
                      </span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold">
                      Khám bệnh
                    </h3>
                  </a>
                  <a
                    className="group flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    href="#"
                  >
                    <div className="flex items-center justify-center size-16 bg-primary/20 rounded-full text-primary">
                      <span className="material-symbols-outlined text-4xl!">
                        shower
                      </span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold">
                      Spa &amp; Grooming
                    </h3>
                  </a>
                  <a
                    className="group flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    href="#"
                  >
                    <div className="flex items-center justify-center size-16 bg-primary/20 rounded-full text-primary">
                      <span className="material-symbols-outlined text-4xl!">
                        pet_supplies
                      </span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold">
                      Khách sạn thú cưng
                    </h3>
                  </a>
                </div>
              </section>
            </main>
            {/* Footer */}
            <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 py-8 px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    PetCare Connect
                  </h3>
                  <a
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    href="#"
                  >
                    Về chúng tôi
                  </a>
                  <a
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    href="#"
                  >
                    Liên hệ
                  </a>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Hỗ trợ
                  </h3>
                  <a
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    href="#"
                  >
                    Điều khoản dịch vụ
                  </a>
                  <a
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    href="#"
                  >
                    Chính sách bảo mật
                  </a>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Dành cho đối tác
                  </h3>
                  <a
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    href="#"
                  >
                    Đăng ký Business
                  </a>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Theo dõi chúng tôi
                  </h3>
                  <div className="flex gap-4">
                    <a
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      href="#"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          clipRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      href="#"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      href="#"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          clipRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.792 2.792c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-2.792 2.792c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-2.792-2.792c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 012.792-2.792c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118a4.053 4.053 0 110 8.106 4.053 4.053 0 010-8.106zm0 6.643a2.59 2.59 0 100-5.18 2.59 2.59 0 000 5.18zM17.42 6.31a1.182 1.182 0 11-2.364 0 1.182 1.182 0 012.364 0z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>© 2024 PetCare Connect. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
