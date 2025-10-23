using AutoMapper;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Department
            CreateMap<Department, DepartmentDTO>().ReverseMap();
            CreateMap<CreateDepartmentDTO, Department>().ReverseMap();

            // Designation
            CreateMap<Designation, DesignationDTO>().ReverseMap();

            // Employee
            CreateMap<Employee, EmployeeDTO>()
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department))
                .ForMember(dest => dest.Designation, opt => opt.MapFrom(src => src.Designation));

            // CreateEmployee → Employee
            CreateMap<CreateEmployeeDTO, Employee>()
                .ForMember(dest => dest.DeptId, opt => opt.MapFrom(src => src.DeptId))
                .ForMember(dest => dest.DesignationId, opt => opt.MapFrom(src => src.DesignationId))
                .ForMember(dest => dest.Department, opt => opt.Ignore())
                .ForMember(dest => dest.Designation, opt => opt.Ignore());

        }
    }
}
