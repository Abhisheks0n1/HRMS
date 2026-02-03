from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Count
from django.db import models
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer

class EmployeeListCreate(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeDelete(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class AttendanceListCreate(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        employee_id = self.request.query_params.get('employee_id')
        date = self.request.query_params.get('date') 
        queryset = super().get_queryset()
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)
        if date:
            queryset = queryset.filter(date=date)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardSummary(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        total_employees = Employee.objects.count()
        attendance_summary = Attendance.objects.values('employee__full_name').annotate(
            total_present=Count('id', filter=models.Q(status='Present'))
        )
        return Response({
            'total_employees': total_employees,
            'attendance_summary': list(attendance_summary)
        })