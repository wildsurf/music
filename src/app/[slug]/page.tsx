import PageLayout from "../components/song";
import { client, previewClient } from "@/lib/client";

const fetchSongCollection = async (preview: boolean, slug: string) => {
  const gqlClient = preview ? previewClient : client;

  try {
    const songCollection = await gqlClient.songCollection({
      where: {
        slug,
      },
    });

    return {
      revalidate: 60,
      props: {
        previewActive: !!preview,
        songCollection,
      },
    };
  } catch {
    return {
      notFound: true,
      revalidate: 100000,
    };
  }
};

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const songCollection = await fetchSongCollection(true, slug);
  const song = songCollection.props?.songCollection.songCollection?.items?.[0];
  return <>{song && <PageLayout song={song} />}</>;
}
