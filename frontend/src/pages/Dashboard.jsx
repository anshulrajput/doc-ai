/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useState } from 'react'
import UIContext from '../store/ui-context'
import AuthContext from '../store/auth-context'
import { dataApiClient } from '../api/client'
import DataCard from '../ui_components/DataCard'
import DashboardTable from '../ui_components/DashboardTable'

function Dashboard() {
	const [rows, setRows] = useState([])
	const [totalCount, setTotalCount] = useState(0)
	const [currentPage] = useState(1)

	const { dispatch: uiDispatch } = useContext(UIContext)
	const { state: authState, getAuthenticatedUser } = useContext(AuthContext)

	console.log(authState.email)

	// api calls on page load
	useEffect(() => {
		;(async function pageLoadApiCalls() {
			uiDispatch({ type: 'start_loader' })
			await getAuthenticatedUser()

			await getAllDocumentsApi()
			uiDispatch({ type: 'stop_loader' })
		})()

		return () => {
			// cleanup
			console.log('CLEAN UP')
		}
	}, [])

	async function getAllDocumentsApi(){
		try {
			const res = await dataApiClient.get('/documents')
			console.log(res)

			if (res.status === 200 && res.data.status === true) {

				setRows(res.data.data.document_list)
				setTotalCount(res.data.data.document_list.length)

				setTimeout(() => {
					console.log(rows)
					console.log(totalCount)
				}, 500);
			} else {
				return Promise.reject({
					message: res.data.message !== undefined ? res.data.message : null
				})
			}
		} catch (err) {
			console.log(err)
			return Promise.reject({
				message: err.response.message !== undefined ? err.response.message : 'Something Went Wrong!'
			})
		}
	}

	return (
		<div>
			
			<div className="row justify-content-center w-100">

                <div className="col-xl-3 col-lg-3 col-md-3">
					<DataCard keyName={'Total Units Consumed'} value={'100022'} />
				</div>

				<div className="col-xl-3 col-lg-3 col-md-3">
					<DataCard keyName={'Total Documents'} value={'100022'} />
				</div>

				<div className="col-xl-3 col-lg-3 col-md-3">
					<DataCard keyName={'Total Unique Customer Id'} value={'100022'} />
				</div>

				<div className="col-xl-3 col-lg-3 col-md-3">
					<DataCard keyName={'Total Amount'} value={'100022'} />
				</div>

			</div>

			<div className="row justify-content-center w-100">

                <div className="col-xl-12 col-lg-12 col-md-12">
					<div className="card o-hidden border-0 shadow">
						<div className="card-body p-0">
							<DashboardTable rows={rows} totalCount={totalCount} currentPage={currentPage} />
						</div>
					</div>
				</div>

			</div>
			
		</div>
	)
}

export default Dashboard
