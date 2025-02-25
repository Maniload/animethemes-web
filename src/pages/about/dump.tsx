import type { GetStaticProps } from "next";
import Link from "next/link";

import { faDownload } from "@fortawesome/free-solid-svg-icons";
import gql from "graphql-tag";

import { Column } from "@/components/box/Flex";
import { IconTextButton } from "@/components/button/IconTextButton";
import { SummaryCard } from "@/components/card/SummaryCard";
import { SEO } from "@/components/seo/SEO";
import { Text } from "@/components/text/Text";
import type { DumpIndexPageQuery } from "@/generated/graphql";
import { fetchData } from "@/lib/server";
import type { SharedPageProps } from "@/utils/getSharedPageProps";
import getSharedPageProps from "@/utils/getSharedPageProps";
import type { Comparator } from "@/utils/types";

interface DumpIndexPageProps extends SharedPageProps, DumpIndexPageQuery {}

const sortByDateDesc: Comparator<DumpIndexPageProps["dumpAll"][number]> = (a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

export default function DumpIndexPage({ dumpAll }: DumpIndexPageProps) {
    return (
        <>
            <SEO title="Database Dumps" description="Download dumps of the AnimeThemes.moe database." />
            <Text variant="h1">AnimeThemes.moe Database Dumps</Text>
            <Column style={{ "--gap": "16px" }}>
                <Text as="p">
                    Here you can find sanitized database dumps from AnimeThemes.moe intended for seeding local
                    environments.
                </Text>
                <Text as="p">These are two types of dumps:</Text>
                <ul>
                    <li>
                        <Text weight="bold">Wiki</Text> dumps contain information to anime, themes, videos, artists,
                        etc.
                    </li>
                    <li>
                        <Text weight="bold">Document</Text> dumps contain all the pages you also find in the{" "}
                        <Text as={Link} link href="/wiki">
                            Wiki
                        </Text>{" "}
                        section.
                    </li>
                </ul>
            </Column>
            <Text variant="h2">Available dumps</Text>
            {dumpAll.sort(sortByDateDesc).map((dump) => (
                <SummaryCard
                    key={dump.path}
                    title={dump.path}
                    description={`Created at: ${new Date(dump.created_at).toLocaleString()}`}
                >
                    <IconTextButton asChild variant="solid" icon={faDownload} collapsible>
                        <a href={dump.link} download>
                            Download
                        </a>
                    </IconTextButton>
                </SummaryCard>
            ))}
        </>
    );
}

export const getStaticProps: GetStaticProps<DumpIndexPageProps> = async () => {
    const { data, apiRequests } = await fetchData<DumpIndexPageQuery>(gql`
        query DumpIndexPage {
            dumpAll {
                path
                link
                created_at
            }
        }
    `);

    const props: DumpIndexPageProps = {
        ...getSharedPageProps(apiRequests),
        dumpAll: data.dumpAll,
    };

    return {
        props,
        // Revalidate after 3 hours (= 10800 seconds).
        revalidate: 10800,
    };
};
