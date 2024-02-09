import { Box, Breadcrumbs, Link } from "@mui/material";
import { getInObj } from "@opentf/utils";

type Props = {
  UI: Record<string, unknown> | null;
  selectionPath: string;
  setSelectionPath: (s: string) => void;
};

export default function BreadCrumbs({
  UI,
  selectionPath,
  setSelectionPath,
}: Props) {
  const renderBreadcrumbItems = () => {
    const items = [
      <Link key="root" underline="hover" onClick={() => setSelectionPath("")}>
        Root
      </Link>,
    ];

    const arr = selectionPath.split(".");
    let curPath = "";
    arr.slice(1).forEach((str, i) => {
      const curSelPath = curPath + "." + str;
      curPath = curSelPath;
      const obj = getInObj(UI || {}, curPath) as Record<string, unknown>;
      items.push(
        <Link
          key={i}
          underline="hover"
          onClick={() => setSelectionPath(curSelPath)}
        >
          {obj?.name as string}
        </Link>
      );
    });

    return items;
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {renderBreadcrumbItems()}
      </Breadcrumbs>
    </Box>
  );
}
