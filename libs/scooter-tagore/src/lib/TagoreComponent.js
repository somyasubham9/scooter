import React, { useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import InnerHTML from "dangerously-set-html-content";

export const TagoreComponent = props => {
  const [data, setData] = React.useState(null);

  useEffect(() => {
    setData({ html: props?.node?.attrs?.["data-html"] });
  }, [props]);

  return (
    <NodeViewWrapper className="tagore-node-view-wrapper">
      {data && <InnerHTML className="tagore-content" html={data.html} />}
    </NodeViewWrapper>
  );
};

export default TagoreComponent;
