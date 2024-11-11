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
      <div className="bg-tableFooter border border-tableFooterBorder flex flex-col sm:flex-row justify-between items-start sm:items-center lg:pl-72 w-full py-3 px-2 sm:px-4">
        <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-0">
            <div className="flex space-x-3">
              
            </div>
        </div>
        <div className="flex flex-wrap items-center justify-start sm:justify-end space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <span className="text-sm text-default-600">Items per Page</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="ml-2 py-1 px-2 border rounded bg-transparent text-sm text-default-600"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={150}>150</option>
              <option value={250}>250</option>
            </select>
          </div>
          <div className="ml-0 sm:ml-5 text-black">
          <Pagination
            isCompact
            showControls
            color="primary"
            variant="flat"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
            className="mx-0 xs:mx-2"
          />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
