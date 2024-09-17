from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Document
from .serializers import DocumentSerializer
import json
import os

def readDocumentJson(path):
    # read json data from the path (for now reading from local folder, but ideally it should be fetched from the gcs)
    # Get the directory one level above
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Path to the JSON file
    file_path = os.path.join(BASE_DIR, path)
    print(file_path)

    with open(file_path, 'r') as file:
        data = json.load(file)

        return data

class DocumentListView(APIView):
    def get(self, request):
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)

        response = {
            'document_list': serializer.data,
        }

        for i in range(len(response['document_list'])):
            # Read JSON File
            output_path = response['document_list'][i]['output_path']
            json_output = readDocumentJson(output_path)
            response['document_list'][i]['customer_id'] = json_output['kvs']['customer_id']['values']
            response['document_list'][i]['customer_name'] = json_output['kvs']['customer_name']['values']
            response['document_list'][i]['amount_before_due_date'] = json_output['kvs']['amount_before_due_date']['values']
            response['document_list'][i]['address'] = json_output['kvs']['address']['values']
            response['document_list'][i]['due_date'] = json_output['kvs']['due_date']['values']
            response['document_list'][i]['amount_after_due_date'] = json_output['kvs']['amount_after_due_date']['values']
            response['document_list'][i]['meter_number'] = json_output['kvs']['meter_number']['values']
            response['document_list'][i]['opening_meter_reading'] = json_output['kvs']['opening_meter_reading']['values']
            response['document_list'][i]['closing_meter_reading'] = json_output['kvs']['closing_meter_reading']['values']
            response['document_list'][i]['unit_consumption'] = json_output['kvs']['unit_consumption']['values']
            response['document_list'][i]['bill_date'] = json_output['kvs']['bill_date']['values']
            response['document_list'][i]['board_name'] = json_output['kvs']['board_name']['values']


        return Response({
            'status': True,
            'message': 'Document List Fetched Successfully',
            'data': response
        }, status=status.HTTP_200_OK)
    
class DocumentDetailView(APIView):
    def get(self, request, pk):
        try:
            document = Document.objects.get(pk=pk)
            serializer = DocumentSerializer(document)

            response = {
                'document': serializer.data,
            }

            # Read JSON File
            output_path = serializer.data['output_path']
            response['json_output'] = readDocumentJson(output_path)

            return Response({
                'status': True,
                'message': 'Document Fetched Successfully',
                'data': response
            }, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({
                'status': False,
                'message': f'Document with id {pk} does not exist',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        except FileNotFoundError:
            return Response({
                'status': False,
                'message': 'Document File Not Found in Storage',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
