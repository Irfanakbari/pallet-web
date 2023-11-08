export const LoadingSpin = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        style={{width: `35px`, height: `35px`}}
        className="animate-spin">
        <div className="h-full w-full border-4 border-t-purple-500 border-b-purple-700 rounded-[50%]"></div>
      </div>
    </div>
  );
};
