import ButtonLink from "@/components/ButtonLink";
import CardUser from "@/components/CardUser";

export default function UserListPage({
  users = [],
  setShowModalDelete,
  setIdDelete,
}) {
  return (
    <div className="relative flex w-full max-w-4xl flex-col space-y-3">
      <div className="relative flex w-full items-center justify-between">
        <h1 className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
          Daftar Users
        </h1>
        <ButtonLink link="/users/add" text="Tambah User" />
      </div>
      {users.map((item, index) => (
        <CardUser
          key={index}
          user={item}
          onDelete={() => setShowModalDelete(true)}
          setIdDelete={setIdDelete}
        />
      ))}
    </div>
  );
}
