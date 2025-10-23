using AutoMapper;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repository;

namespace EmployeeManagement.API.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _repo;
        private readonly IMapper _mapper;

        public DepartmentService(IDepartmentRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DepartmentDTO>> GetAllAsync()
        {
            var result = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<DepartmentDTO>>(result);
        }

        public async Task<DepartmentDTO> GetByIdAsync(int id)
        {
            var dept = await _repo.GetByIdAsync(id);
            return _mapper.Map<DepartmentDTO>(dept);
        }

        public async Task<DepartmentDTO> CreateAsync(CreateDepartmentDTO dto)
        {
            var dept = _mapper.Map<Department>(dto);
            var created =  await _repo.CreateAsync(dept);

            var fullDept = await _repo.GetByIdAsync(created.DeptId);
            return _mapper.Map<DepartmentDTO>(fullDept);
        }

        public async Task DeleteAsync(int DeptId)
        {
            var dept = await _repo.GetByIdAsync(DeptId);
            var DeptDelete = _mapper.Map<Department>(dept);
            await _repo.DeleteAsync(DeptDelete);
        }

        public async Task<DepartmentDTO> UpdateAsync(int id, CreateDepartmentDTO dto)
        {
            var Existingdept = await _repo.GetByIdAsync(id);
            if (Existingdept == null) return new();

            var dept = _mapper.Map(dto, Existingdept);
            var updatedDept = await _repo.UpdateAsync(dept);

            var result = await _repo.GetByIdAsync(id);
            return _mapper.Map<DepartmentDTO>(result);
        }
    }
}
