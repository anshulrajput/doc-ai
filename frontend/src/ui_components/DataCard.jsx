/* eslint-disable react-hooks/exhaustive-deps */
import styles from './DataCard.module.css'

function DataCard(props) {

	return (
		<div className={styles['data-card']+" card o-hidden border-0 shadow"}>
            <div className="card-body p-1 d-flex justify-content-center flex-column align-items-center">
                <span className="fw-bold fs-5">{props.keyName}</span>
                <span className="fw-bold fs-5">{props.value}</span>
            </div>
        </div>
	)
}

export default DataCard
