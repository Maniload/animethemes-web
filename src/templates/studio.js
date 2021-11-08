import { SidebarContainer } from "components/container";
import styled from "styled-components";
import { AnimeSummaryCard } from "components/card";
import { SEO } from "components/seo";
import { graphql } from "gatsby";
import useImage from "hooks/useImage";
import { Box, Flex } from "components/box";
import { Text } from "components/text";
import { AspectRatio, Collapse } from "components/utils";
import { useState } from "react";
import { SearchFilterGroup, SearchFilterSortBy } from "components/search-filter";
import useToggle from "hooks/useToggle";
import { FilterToggleButton } from "components/button";
import { animeNameComparator, animePremiereComparator, chain, reverse } from "utils/comparators";

const StyledCoverContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
`;
const StyledCoverItemContainer = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
`;
const StyledCover = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const sortByComparators = new Map([
    [ "A ➜ Z", animeNameComparator ],
    [ "Z ➜ A", reverse(animeNameComparator) ],
    [ "Old ➜ New", chain(animePremiereComparator, animeNameComparator) ],
    [ "New ➜ Old", chain(reverse(animePremiereComparator), animeNameComparator) ]
]);
const sortByOptions = [ ...sortByComparators.keys() ];

export default function StudioDetailPage({ data: { studio } }) {
    const anime = studio.anime;
    const images = [
        useImage(anime[0]),
        useImage(anime[1]),
        useImage(anime[2]),
        useImage(anime[3])
    ].map((images) => images.largeCover).filter((image) => !!image);

    const [ showFilter, toggleShowFilter ] = useToggle();
    const [ sortBy, setSortBy ] = useState(sortByOptions[0]);

    const animeSorted = [ ...anime ].sort(sortByComparators.get(sortBy));

    return (
        <Box gapsColumn="1.5rem">
            <SEO title={studio.name} />
            <Text variant="h1">{studio.name}</Text>
            <SidebarContainer>
                <Box display={[ "none", "block" ]} gapsColumn="1.5rem">
                    <AspectRatio ratio={2 / 3}>
                        <StyledCoverContainer>
                            {images.map((image) => (
                                <StyledCoverItemContainer key={image}>
                                    <StyledCover loading="lazy" src={image}/>
                                </StyledCoverItemContainer>
                            ))}
                        </StyledCoverContainer>
                    </AspectRatio>
                </Box>
                <Box gapsColumn="1.5rem">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text variant="h2">
                            Anime
                            <Text color="text-disabled"> ({anime.length})</Text>
                        </Text>
                        <FilterToggleButton onClick={toggleShowFilter}/>
                    </Flex>
                    <Collapse collapse={!showFilter}>
                        <SearchFilterGroup>
                            <SearchFilterSortBy
                                options={sortByOptions}
                                value={sortBy}
                                setValue={setSortBy}
                            />
                        </SearchFilterGroup>
                    </Collapse>
                    <Box gapsColumn="1rem">
                        {animeSorted.map((anime) => (
                            <AnimeSummaryCard key={anime.slug} anime={anime}/>
                        ))}
                    </Box>
                </Box>
            </SidebarContainer>
        </Box>
    );
}

export const query = graphql`
    query($slug: String!) {
        studio(slug: { eq: $slug }) {
            slug
            name
            anime {
                ...AnimeCard
                ...AnimeCardThemes
            }
        }
    }
`;