import JoinRoom from "@/components/share/joinRoom";

async function page({ params }) {
  const { id } = await params;

  return <JoinRoom id={id} />;
}

export default page;
