import React from "react";
import { usePathname } from 'next/navigation';
import { Pagination, Button } from "@nextui-org/react";
import { BsFiletypePdf, BsFiletypeCsv } from "react-icons/bs";

export default function CustomPagination({
  page,
  pages,
  rowsPerPage,
  handleChangeRowsPerPage,
  items,
  setPage,
  children,
  dataCSVButton,
}) {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];
  const filename = `${lastSegment}.csv`;

  return (
    <>
    <div className="bg-tableFooter border border-tableFooterBorder flex justify-between items-center lg:pl-72 w-full py-3">
      <div>
        {dataCSVButton && dataCSVButton.length > 0 && (
          <div className="ml-5 space-x-3 flex flex-row">
            <Button><BsFiletypePdf size={17}/> PDF</Button>
            <Button><BsFiletypeCsv size={17}/> CSV</Button>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center">
        <Pagination
          isCompact
          showControls
          color="primary"
          variant="flat"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
          className="mx-5"
        />
        <div>
          <span className="text-sm text-black">Page Records</span>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="ml-2 py-1 px-2 border rounded bg-transparent text-sm text-default-600 mx-5"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={150}>150</option>
            <option value={250}>250</option>
          </select>
        </div>
        <div className="ml-5 mr-10 text-black">
          {items?.length > 0
            ? `${(page - 1) * rowsPerPage + 1}-${Math.min(
                page * rowsPerPage,
                items.length
              )} Pagination of ${items.length}`
            : "No Records"}
        </div>
      </div>
    </div>
    {children}
    </>
  );
}
