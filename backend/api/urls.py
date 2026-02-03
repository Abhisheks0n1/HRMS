from django.urls import path
from .views import EmployeeListCreate, EmployeeDelete, AttendanceListCreate, DashboardSummary

urlpatterns = [
    path('employees/', EmployeeListCreate.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeDelete.as_view(), name='employee-delete'),
    path('attendances/', AttendanceListCreate.as_view(), name='attendance-list-create'),
    path('dashboard/', DashboardSummary.as_view(), name='dashboard-summary'),
]