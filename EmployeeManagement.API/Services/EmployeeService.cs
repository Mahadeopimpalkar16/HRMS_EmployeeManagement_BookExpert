using AutoMapper;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repository;

namespace EmployeeManagement.API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repo;
        private readonly IMapper _mapper;
        public EmployeeService(IEmployeeRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmployeeDTO>> GetFilteredAsync(string coumnName, string searchValue)
        {
            var result = await _repo.GetFilteredAsync(coumnName, searchValue);
            return _mapper.Map<IEnumerable<EmployeeDTO>>(result);

        }
        public async Task<EmployeeDTO> CreateAsync(CreateEmployeeDTO dto)
        {
            var emp = _mapper.Map<Employee>(dto);
            var createdEmp = await _repo.CreateAsync(emp);

            var fullEmployee = await _repo.GetByIdAsync(createdEmp.Id);
            return _mapper.Map<EmployeeDTO>(fullEmployee);
        }

        public async Task<IEnumerable<EmployeeDTO>> GetAllAsync()
        {
            var employees = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<EmployeeDTO>>(employees);
        }

        public async Task<EmployeeDTO?> GetByIdAsync(int id)
        {
            var employee = await _repo.GetByIdAsync(id);
            return _mapper.Map<EmployeeDTO>(employee);
        }

        public async Task<EmployeeDTO?> UpdateAsync(int id, CreateEmployeeDTO dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return new();


            var emp = _mapper.Map(dto, existing);
            var employee = await _repo.UpdateAsync(emp);

            var updated = await _repo.GetByIdAsync(id);
            return _mapper.Map<EmployeeDTO>(updated);
        }

        public async Task BulkDeleteAsync(IEnumerable<int> employeeIds)
        {
            await _repo.BulkDeleteAsync(employeeIds);
        }
        public async Task DeleteAsync(int id)
        {
            var ExistingEmp = await _repo.GetByIdAsync(id);
            var DeleteEmp = _mapper.Map<Employee>(ExistingEmp);
            await _repo.DeleteAsync(DeleteEmp);

        }

        public async Task<EmployeeDTO> GetByEmailAsync(string email)
        {
            var user =  await _repo.GetEmployeeByEmail(email);
            return _mapper.Map<EmployeeDTO>(user);
        }

        public async Task<IEnumerable<States>> GetAllStates()
        {
            return await _repo.GetAllStates();
        }
    }
}
