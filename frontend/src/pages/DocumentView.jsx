/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useState, Fragment, useRef } from 'react'
import UIContext from '../store/ui-context'
import AuthContext from '../store/auth-context'
import { dataApiClient } from '../api/client'
import { useNavigate, useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { IoArrowBackOutline } from "react-icons/io5";

import { pdfjs, Document, Page } from 'react-pdf';
import {STATIC_FILES_URL} from '../utils/Constants'
import { GrNext, GrPrevious } from "react-icons/gr";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import DocumentForm from '../ui_components/DocumentForm'
import styled from 'styled-components'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url,
).toString();

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function DocumentView() {
	const navigate = useNavigate()
	const params = useParams()
	const { id } = params
	const [documentData, setDocumentData] = useState(null)
	const [jsonOutput, setJsonOutput] = useState(null)

	const [pdfUrl, setPdfUrl] = useState(null)
	const [numPages, setNumPages] = useState()
	const [pageNumber, setPageNumber] = useState()
	const [isRendered, setIsRendered] = useState()
	const canvas = useRef()
	const customCanvas = useRef()

	const { dispatch: uiDispatch } = useContext(UIContext)
	const { getAuthenticatedUser } = useContext(AuthContext)

	// api calls on page load
	useEffect(() => {
		;(async function pageLoadApiCalls() {
			uiDispatch({ type: 'start_loader' })
			await getAuthenticatedUser()

			await getDocumentDataApi(id)
			uiDispatch({ type: 'stop_loader' })
		})()
	}, [])

	useEffect(() => {
		;(async function convertPdfUrl() {
			if(documentData) {
				const arrayBuffer = await fetch(STATIC_FILES_URL+'/'+documentData.document_path);
				const blob = await arrayBuffer.blob();
				const url = await blobToURL(blob);
		
				setPdfUrl(url)
			}
		})()
	}, [documentData])

	useEffect(() => {
		// set widht and height of the custom canvas
		if (!isRendered || !canvas.current) {
			return;
		}
		if(canvas) {
			const canvasWidth = window.getComputedStyle(canvas.current).getPropertyValue("width")
			const canvasHeight = window.getComputedStyle(canvas.current).getPropertyValue("height")
	
			customCanvas.current.style.width = canvasWidth
			customCanvas.current.style.height = canvasHeight

			customCanvas.current.width = canvas.current.width
			customCanvas.current.height = canvas.current.height

		}


	}, [isRendered])

	function onHoverHandler(data){
		// console.log('Hover started')
		// console.log(data)

		let pdfWidth = jsonOutput.image.width
		let pdfHeight = jsonOutput.image.height

		// console.log(pdfWidth)
		// console.log(pdfHeight)

		let x1 = 0
		let x2 = 0
		let y1 = 0
		let y2 = 0

		// console.log(data.page_num)
		// console.log(pageNumber)
		if(data.page_num === pageNumber){
			console.log(data.value_box)

			x1 = data.value_box[0].x
			x2 = data.value_box[1].x
			y1 = data.value_box[0].y
			y2 = data.value_box[2].y

			console.log('x1 - ',x1)
			console.log('x2 - ',x2)
			console.log('y1 - ',y1)
			console.log('y2 - ',y2)

			createBoundingBox(x1,y1,x2,y2)
		}
	}

	function createBoundingBox(x1,y1,x2,y2){
		const context = customCanvas.current.getContext('2d');
		var { width: canvasWidth, height: canvasHeight } = canvas.current;

		x1 = x1 * canvasWidth
		x2 = x2 * canvasWidth
		y1 = y1 * canvasHeight
		y2 = y2 * canvasHeight

		context.save();

		// ---

		// console.log('canvas width - ',canvasWidth)
		// console.log('canvas height - ',canvasHeight)

		context.beginPath()
		context.rect(x1, y1, x2-x1, y2-y1)
		context.strokeStyle = 'black'
		context.lineWidth = 2
		context.stroke()

		context.fillStyle = 'rgba(0, 0, 0, 0.215)'
		context.fillRect(0, 0, canvasWidth, canvasHeight);
		context.clearRect(x1, y1, Math.abs(x2-x1), Math.abs(y2-y1))

		context.restore()

		console.log(x1, y1, x2-x1, y2-y1)

		console.log('CREATED')
	}

	function clearCanvas(){
		const context = customCanvas.current.getContext('2d');

		// Store the current transformation matrix
		context.save();

		context.clearRect(0, 0, customCanvas.current.width, customCanvas.current.height);

		context.restore();

		console.log('CLEARED')
	}

	function onHoverLeaveHandler(){
		clearCanvas()
	}

	function blobToURL(blob) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function () {
				const base64data = reader.result;
				resolve(base64data);
			};
		});
	}

	function onDocumentLoadSuccess(document) {
		const { numPages: nextNumPages } = document

		setNumPages(nextNumPages)
		setPageNumber(1)
	}

	function changePage(offset) {
		const newPageNumber = pageNumber + offset

		if(newPageNumber > numPages || newPageNumber < 0){
			return
		}

		setPageNumber((prevPageNumber) => (prevPageNumber || 1) + offset)
	}

	const previousPage = () => changePage(-1)
  	const nextPage = () => changePage(1)

	function onRenderSuccess() {
		setIsRendered(true);
	}

	function backButtonHandler(){
        navigate('/dashboard')
    }

	async function getDocumentDataApi(id){
		try {
			const res = await dataApiClient.get('/documents/'+id)
			console.log(res.data)
			console.log(res.data.data.document)

			if (res.status === 200 && res.data.status === true) {

				console.log(res.data.data.document)
				console.log(res.data.data.json_output)

				setDocumentData(() => res.data.data.document)
				setJsonOutput(() => res.data.data.json_output)

				console.log(jsonOutput)

				setTimeout(() => {
					console.log(documentData)
					console.log(jsonOutput)
				}, 0);
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
		<Fragment>
			<div className="row justify-content-center w-100">

				<div className="col-xl-7 col-lg-7 col-md-7" style={{'overflowY': 'scroll'}}>
					<div className="d-flex w-100">
						<div>
							<Button size="sm" className='primary-btn' onClick={() => backButtonHandler()}>
								<IoArrowBackOutline />
							</Button>
							<span className='ms-2 fw-bold'>
								{ jsonOutput && jsonOutput.filename }
							</span>
						</div>
						<div className='m-auto'>
							<Button size="sm" className='primary-btn me-2' onClick={() => previousPage()}>
								<GrPrevious />
							</Button>
							<span>{`Page ${pageNumber || (numPages ? 1 : '--')} of ${numPages || '--'}`}</span>
							<Button size="sm" className='primary-btn ms-2' onClick={() => nextPage()}>
								<GrNext />
							</Button>
						</div>
						
					</div>

					<PdfContent>
						<StyledPdfDocument file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} >
							<StyledPdfPage
								key={`page_${pageNumber + 1}`}
								pageNumber={pageNumber || 1}
								canvasRef={canvas}
								onRenderSuccess={onRenderSuccess}
							/>
						</StyledPdfDocument>
						<CanvasContainer ref={customCanvas}></CanvasContainer>
					</PdfContent>
				</div>

				<div className="col-xl-5 col-lg-5 col-md-5">
					<div className="d-flex w-100">
						<span className='ms-2 fw-bold mb-2'>
							Extracted Information
						</span>					
					</div>

					{
						jsonOutput && jsonOutput.kvs &&
						<DocumentForm output={jsonOutput} onHover={onHoverHandler} onHoverLeave={onHoverLeaveHandler} ></DocumentForm>
					}
				</div>

			</div>
		</Fragment>
	)
}

export const PdfContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  overflow: auto;
  overflow-y: scroll;
  max-height: calc(-10rem + 100vh);
`;

export const CanvasContainer = styled.canvas`
  position: absolute;
  width: 100%;
  height: auto;
  z-index: 100;
`;


export const StyledPdfPage = styled(Page)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .react-pdf__Page {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;

  }
`;

export const StyledPdfDocument = styled(Document)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .react-pdf__Document {
    width: 100%;
  }
`;

export default DocumentView
