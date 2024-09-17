import { useMemo, Fragment } from 'react'
import Button from 'react-bootstrap/Button'
import DataTable from 'react-data-table-component'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

function DashboardTable(props) {
    const navigate = useNavigate()

    function viewDocumentHandler(row){
        console.log(row.id)
        navigate('/document/'+row.id)
    }

	const columns = useMemo(
		() => [
            {
				name: 'View',
				cell: (row, index, column, id) => (
					<Button size="sm" className="primary-btn" onClick={() => viewDocumentHandler(row)}>View</Button>
				),
				button: true,
				wrap: true,
				width: '5%',
			},
			{
				name: <div>Document Name</div>,
				selector: (row) => row.name,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: 'Customer Id',
				selector: (row) => row.customer_id,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: 'Customer Name',
				selector: (row) => row.customer_name,
				sortable: false,
                wrap: true,
				width: '14%',
			},
			{
				name: <div>Amt Before Due Date</div>,
				selector: (row) => row.amount_before_due_date,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: 'Address',
				selector: (row) => row.address,
				sortable: false,
                wrap: true,
				width: '15%',
			},
			{
				name: 'Due Date',
				selector: (row) => row.due_date,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: <div>Amt After Due Date</div>,
				selector: (row) => row.amount_after_due_date,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: 'Meter No.',
				selector: (row) => row.meter_number,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: <div>Opening Meter Reading</div>,
				selector: (row) => row.opening_meter_reading,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: <div>Closing Meter Reading</div>,
				selector: (row) => row.closing_meter_reading,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: <div>Unit Consumption</div>,
				selector: (row) => row.unit_consumption,
				sortable: false,
                wrap: true,
				width: '10%',
			},
			{
				name: 'Bill Date',
				selector: (row) => row.bill_date,
				sortable: false,
                wrap: true,
				width: '8%',
			},
			{
				name: 'Board Name',
				selector: (row) => row.board_name,
				sortable: false,
                wrap: true,
				width: '15%',
			}
		],
		[],
	)

	return (
		<Fragment>
            {props.rows && props.rows.length > 0 && (
                <StyledDatabale
                    fixedHeader
                    pagination
                    paginationTotalRows={props.totalCount}
                    paginationDefaultPage={props.currentPage}
                    data={props.rows}
                    columns={columns}
                />
            )}
        </Fragment>
	)
}

// Static object
const StyledDatabale = styled(DataTable)`
    .rdt_Table{
        max-height: calc(100vh - 13.6em);
    }
    .rdt_TableHead{
        font-weight: 700;
        font-size: 0.9em;
        color: var(--primary-fill);
    }
    .rdt_TableRow{
        font-size: 0.78em;
        color: var(--primary-black);
        min-height: 50px;
    }
    rows: {
        style: {
            minHeight: '72px', // override the row height
        }
    }
`

export default DashboardTable
