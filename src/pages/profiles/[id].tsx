import { AiOutlineArrowLeft } from "react-icons/ai";
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { ProfileImage } from "~/components/ProfileImage";
import { InfiniteTweetList } from "~/components/InfiniteTweetList";
import { useSession } from "next-auth/react";
import { Button } from "~/components/Button";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ id }) => {
    const { data: profile } = api.profile.getById.useQuery({ id });
    const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery({ userId: id }, { getNextPageParam: (lastPage) => lastPage.nextCursor });
    const trpcUtils = api.useContext();
    const toggleFollow = api.profile.toggleFollow.useMutation({
        onSuccess: ({ addedFollow }) => {
            trpcUtils.profile.getById.setData({ id }, oldData => {
                if (oldData == null) return;

                const countModifier = addedFollow ? 1 : -1;
                return {
                    ...oldData,
                    isFollowing: addedFollow,
                    followersCount: oldData.followersCount + countModifier
                }
            });
        }
    });
    if (profile == null || profile.name == null) {
        return <ErrorPage statusCode={404} />
    }
    return (
        <>
            <Head>
                <title>{`Tuiter ${profile.name}`}</title>
            </Head>
            <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
                <Link href=".." className="mr-2">
                    <IconHoverEffect>
                        <AiOutlineArrowLeft className="h-6 w-6" />
                    </IconHoverEffect>
                </Link>
                <ProfileImage src={profile.image} className="flex-shrink-0" />
                <div className="ml-2 flex-grow">
                    <h1 className="text-lg font-bold">{profile.name}</h1>
                    <div className="text-gray-500">
                        {profile.tweetsCount}{" "}
                        {getPlural(profile.tweetsCount, "tweet", "tweets")} - {" "}
                        {profile.followersCount}{" "}
                        {getPlural(profile.followersCount, "follower", "followers")} - {" "}
                        {profile.followsCount} Following
                    </div>
                    <FollowButton
                        isFollowing={profile.isFollowing}
                        isLoading={toggleFollow.isLoading}
                        userId={id}
                        onClick={() => toggleFollow.mutate({ userId: id })} />
                </div>
            </header>
            <main>
                <InfiniteTweetList
                    tweets={tweets.data?.pages.flatMap(page => page.tweets)}
                    isError={tweets.isError}
                    isLoading={tweets.isLoading}
                    hasMore={tweets.hasNextPage || false}
                    fetchNewTweets={tweets.fetchNextPage}
                />
            </main>
        </>
    )
}

function FollowButton({ isFollowing, isLoading, userId, onClick }: { isFollowing: boolean, isLoading: boolean, userId: string, onClick: () => void }) {
    const session = useSession();

    if (session.status !== "authenticated" || session.data.user.id === userId) {
        return null;
    }
    return (
        <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    )
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) {
    const id = context.params?.id;

    if (id == null) {
        return {
            redirect: {
                destination: "/",
            }
        }
    }

    const ssg = ssgHelper();
    await ssg.profile.getById.prefetch({ id });

    return {
        props: {
            id,
            trpcState: ssg.dehydrate(),
        },
    }
}

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
    return pluralRules.select(number) === "one" ? singular : plural;
}

export default ProfilePage;