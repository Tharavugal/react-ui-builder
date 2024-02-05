import { Breadcrumbs, Link } from "@mui/material";
import { getInObj } from "@opentf/utils";

export default function BreadCrumbs({ UI, selectionPath, setSelectionPath }) {
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
      const obj = getInObj(UI, curPath);
      items.push(
        <Link
          key={i}
          underline="hover"
          onClick={() => setSelectionPath(curSelPath)}
        >
          {obj?.name}
        </Link>
      );
    });

    return items;
  };

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {renderBreadcrumbItems()}
    </Breadcrumbs>
  );
}
