/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { useRouteMatch, useLocation, Link } from "react-router-dom";
import { WrapperOuter } from "../wrapper";
import css from "./docs.css";

// Docs
import docs from "./index.yml";
import introduction from "!!raw-loader!./resources/introduction.md";
import installation from "!!raw-loader!./resources/installation.md";
import outputLogs from "!!raw-loader!./resources/output-logs.md";
import privacy from "!!raw-loader!./resources/privacy.md";
import decks from "!!raw-loader!./resources/decks.md";
import collection from "!!raw-loader!./resources/collection.md";
import overlays from "!!raw-loader!./resources/overlays.md";

// Images
import deckArchive from "../../assets/images/docs/deck-archive.png";
import deckView from "../../assets/images/docs/deck-view.png";
import detailedLogsImg from "../../assets/images/docs/detailed-logs.png";
import filterBoosters from "../../assets/images/docs/collection-filter-boosters.png";
import viewSets from "../../assets/images/docs/collection-view-sets.png";

import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { reduxAction } from "../../redux/webRedux";

const resources = {
  introduction: introduction,
  installation: installation,
  "output-logs": outputLogs,
  privacy: privacy,
  decks: decks,
  collection: collection,
  overlays: overlays
};

const scrollToRef = (ref): void => window.scrollTo(0, ref.current.offsetTop);

const imageTransform = (img): string => {
  switch (img) {
    case "deck-archive":
      return deckArchive;
    case "deck-view":
      return deckView;
    case "detailed-logs":
      return detailedLogsImg;
    case "collection-filter-boosters":
      return filterBoosters;
    case "collection-view-sets":
      return viewSets;
    default:
      return img;
  }
};

function Heading({ children, ...props }): JSX.Element {
  const { level } = props;
  return React.createElement("h" + level, props, children);
}

const HeadRenderer = (props): JSX.Element => {
  const { nodeKey, children, level } = props;
  const linkRef = useRef(null);
  const id = children[0].props.value.replace(/\s+/g, "-").toLowerCase();
  const [op, setOp] = useState(0);
  const location = useLocation();

  const executeScroll = (): void => scrollToRef(linkRef);

  useEffect(() => {
    setTimeout(() => {
      if (location.hash == "#" + id) {
        executeScroll();
      }
    }, 500);
  }, [id, linkRef, location]);

  return (
    <React.Fragment key={nodeKey}>
      <Heading
        {...props}
        ref={linkRef}
        onMouseEnter={(): void => setOp(0.8)}
        onMouseLeave={(): void => setOp(0)}
      >
        {children}
        <a id={id} href={`#${id}`}>
          <div
            className={css["anchor-link"] + " " + css["anchor-h" + level]}
            style={{ opacity: op }}
          ></div>
        </a>
      </Heading>
    </React.Fragment>
  );
};

export default function Docs(): JSX.Element {
  const dispatch = useDispatch();
  React.useEffect(() => {
    reduxAction(dispatch, { type: "SET_BACK_IMAGE", arg: "" });
  }, [dispatch]);
  const sectionMatch = useRouteMatch<{ section: string }>("/docs/:section");
  const resource = sectionMatch
    ? resources[sectionMatch.params.section]
    : resources.introduction;

  return (
    <WrapperOuter style={{ minHeight: "calc(100vh - 5px)" }}>
      <div className={css["docs-wrapper-top"]}></div>
      <div className={css.docsWrapper}>
        <div className={css.docsSidebar}>
          <div className={css.docsSidebarContent}>
            {docs.docs.map(title => {
              const path = docs[title].path;
              const isActive =
                sectionMatch && sectionMatch.params.section == path;

              if (docs[title].type == "section") {
                return (
                  <div
                    className={
                      css.docsSectionLink +
                      (isActive ? " " + css.docsSectionLinkActive : "")
                    }
                    key={title + "-side"}
                  >
                    <Link to={"/docs/" + path}>{title}</Link>
                  </div>
                );
              }
              if (docs[title].type == "title") {
                return (
                  <div
                    className={css.docsSectionTitle}
                    key={title + "-side-title"}
                  >
                    {title}
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className={css.docsMain}>
          {resource ? (
            <ReactMarkdown
              transformImageUri={imageTransform}
              renderers={{ heading: HeadRenderer }}
              source={resource}
            ></ReactMarkdown>
          ) : (
            <></>
          )}
        </div>
      </div>
    </WrapperOuter>
  );
}
