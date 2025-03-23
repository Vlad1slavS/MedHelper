export default function TopBar() {
  return (
    <>
      <div className=" text-center p-3 font-medium flex justify-between items-center">
        <div className="flex">
          <a className="w-9 mr-4" href="#">
            <img className="" src="/src/assets/logo.svg" alt="" />
          </a>
          <h1 className="text-white font-bold text-2xl"></h1>
        </div>
        <div>
          <i
            className="pi pi-bars bg-white/10 p-3 rounded-full"
            style={{ fontSize: "1.4rem" }}
          ></i>
        </div>
      </div>
    </>
  );
}
