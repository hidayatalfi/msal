// app/api/documents/diff/summary/route.js
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT
        AVG(
          CASE 
            WHEN doc_type IN ('SPP', 'SPPA') 
            THEN TIMESTAMPDIFF(DAY, staff_date, manager_date)
            ELSE NULL
          END
        ) AS spp_sppa_staff_to_manager_days,
        AVG(
          CASE 
            WHEN doc_type IN ('SPP', 'SPPA') 
            THEN TIMESTAMPDIFF(DAY, manager_date, director_date)
            ELSE NULL
          END
        ) AS spp_sppa_manager_to_director_days,
        AVG(
          CASE 
            WHEN doc_type = 'PDDO' 
            THEN TIMESTAMPDIFF(DAY, staff_date, manager_date)
            ELSE NULL
          END
        ) AS pddo_staff_to_manager_days,
        AVG(
          CASE 
            WHEN doc_type = 'PDDO' 
            THEN TIMESTAMPDIFF(DAY, manager_date, director_date)
            ELSE NULL
          END
        ) AS pddo_manager_to_director_days,
        AVG(
          CASE
            WHEN doc_type IN ('SPP', 'SPPA')
              THEN TIMESTAMPDIFF(DAY, staff_date, purchasing_date)
            WHEN doc_type = 'PDDO'
              THEN TIMESTAMPDIFF(DAY, staff_date, finance_date)
            ELSE NULL
          END
        ) AS all_docs_staff_to_final_days
      FROM documents
      WHERE doc_type IN ('SPP', 'SPPA', 'PDDO');
    `;

    const [row] = await executeQuery(query);

    const result = {
      spp_manager:
        row.spp_sppa_staff_to_manager_days !== null
          ? Math.round(row.spp_sppa_staff_to_manager_days)
          : 0,
      spp_director:
        row.spp_sppa_manager_to_director_days !== null
          ? Math.round(row.spp_sppa_manager_to_director_days)
          : 0,
      pddo_manager:
        row.pddo_staff_to_manager_days !== null
          ? Math.round(row.pddo_staff_to_manager_days)
          : 0,
      pddo_director:
        row.pddo_manager_to_director_days !== null
          ? Math.round(row.pddo_manager_to_director_days)
          : 0,
      all_docs:
        row.all_docs_staff_to_final_days !== null
          ? Math.round(row.all_docs_staff_to_final_days)
          : 0,
    };

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error calculating document avg diff:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate document average time difference",
      },
      { status: 500 },
    );
  }
}
