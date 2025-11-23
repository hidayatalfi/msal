import { FaUserTie } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
export default function CardUser({ user, onDelete = () => {}, setIdDelete }) {
  return (
    <div className="relative flex h-fit w-full cursor-default flex-col items-center space-x-3 rounded-xl border border-gray-100 bg-white/20 text-black shadow-md shadow-gray-400/10 hover:border-blue-200 hover:bg-white/60 hover:shadow-blue-100">
      <div className="relative flex w-full items-center space-x-3 p-3">
        <div className="flex aspect-square w-20 items-center justify-center rounded-full bg-white/40">
          <FaUserTie className="text-4xl text-blue-500" />
        </div>
        <div className="relative flex h-full w-full flex-col">
          <p className="font-bold">
            {user.fullName} ({user.roles.join(", ")})
          </p>
          <p className="font-medium text-slate-400">{user.username}</p>
        </div>
        {!user.roles.includes("admin") && (
          <button
            onClick={() => {
              onDelete();
              setIdDelete(user.uniqueIdUser);
            }}
            className="mr-3 cursor-pointer rounded-xl bg-red-400 p-3 text-white active:scale-105"
          >
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
}
