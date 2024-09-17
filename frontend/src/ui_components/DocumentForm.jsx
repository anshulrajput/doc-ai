/* eslint-disable react-hooks/exhaustive-deps */
import styles from './DocumentForm.module.css'

function DocumentForm(props) {
    const fields = {
        "customer_id": "Customer Id",
        "customer_name": "Customer Name",
        "amount_before_due_date": "Amt Before Due Date",
        "address": "Address",
        "due_date": "Due Date",
        "amount_after_due_date": "Amt After Due Date",
        "meter_number": "Meter No",
        "opening_meter_reading": "Opening Meter Reading",
        "closing_meter_reading": "Closing Meter Reading",
        "unit_consumption": "Unit Consumption",
        "bill_date": "Bill Date",
        "board_name": "Board Name"
    }

	return (
		<div className="card o-hidden border-0 shadow" style={{
            'overflowY': 'scroll',
            'maxHeight': 'calc(100vh - 10rem)'
            }}>
            <div className="card-body p-1 d-flex justify-content-center flex-column align-items-center">
                
                <div className="d-flex flex-column w-100 justify-content-start p-2">

                    {
                        Object.keys(fields).map((fieldName) => {
                            return ( 
                                <div key={fieldName} className="d-flex flex-column justify-content-start mb-3" onMouseEnter={(e) => props.onHover(props?.output?.kvs?.[fieldName]['bboxes'])} onMouseLeave={(() => props.onHoverLeave())}>
                                    <span className='mb-1 fw-bold'>{fields[fieldName]} :</span>
                                    <span className={styles['form-value']+' border p-1 px-2 rounded'}>
                                        {props?.output?.kvs?.[fieldName]['values']}
                                    </span>
                                </div>
                            )
                        })
                    }

                </div>
                
            </div>
        </div>
	)
}

export default DocumentForm
