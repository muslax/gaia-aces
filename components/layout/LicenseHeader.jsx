import useUser from "hooks/useUser";

export const LicenseHeader = ({ isLoading }) => {
  const { user, mutateUser, isLoading: userIsLoading } = useUser();

  if (isLoading || userIsLoading) return (
    <div className="h-40 bg-yellow-500">
      ...
    </div>
  );

  return (
    <div className="text-xl p-10">
      {user.licenseName}
    </div>
  );
}