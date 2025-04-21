import { Employee } from '../components/EmployeeTable'

const firstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
]

const jobTitles = [
  'Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist', 'DevOps Engineer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'QA Engineer', 'Technical Lead',
  'Project Manager', 'Business Analyst', 'System Administrator', 'Database Administrator', 'Network Engineer',
  'Security Engineer', 'Cloud Architect', 'Mobile Developer', 'UI Designer', 'Scrum Master'
]

const nicknames = [
  'Ace', 'Bear', 'Blaze', 'Boomer', 'Boss', 'Buddy', 'Captain', 'Chief', 'Duke', 'Flash',
  'Guru', 'King', 'Legend', 'Maverick', 'Ninja', 'Phoenix', 'Rocket', 'Shadow', 'Tiger', 'Wolf'
]

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomAge(): number {
  return Math.floor(Math.random() * (65 - 22 + 1)) + 22 // Ages between 22 and 65
}

function generateRandomEmployee(id: number): Employee {
  const firstName = getRandomItem(firstNames)
  const lastName = getRandomItem(lastNames)
  const jobTitle = getRandomItem(jobTitles)
  const nickname = Math.random() > 0.7 ? getRandomItem(nicknames) : undefined // 30% chance of having a nickname

  return {
    id,
    name: `${firstName} ${lastName}`,
    jobTitle,
    age: generateRandomAge(),
    nickname,
    isEmployee: Math.random() > 0.5
  }
}

function generateDummyData(count: number = 1000): Employee[] {
  return Array.from({ length: count }, (_, index) => generateRandomEmployee(index + 1))
}

const dummyData = generateDummyData()

export type SortDirection = 'asc' | 'desc'
export type SortableColumn = keyof Pick<Employee, 'name' | 'age' | 'jobTitle'>
export type UpdatableColumn = keyof Pick<Employee, 'name' | 'jobTitle' | 'age' | 'nickname'>

interface GetDataParams {
  start: number
  limit: number
  sortColumn?: SortableColumn
  sortDirection?: SortDirection
  searchTerm?: string
}

function sortData(data: Employee[], column: SortableColumn, direction: SortDirection): Employee[] {
  return [...data].sort((a, b) => {
    const aValue = a[column]
    const bValue = b[column]

    if (aValue === undefined || bValue === undefined) {
      return 0
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return direction === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })
}

function filterData(data: Employee[], searchTerm?: string): Employee[] {
  if (!searchTerm) return data

  const lowerSearchTerm = searchTerm.toLowerCase()
  return data.filter(employee => 
    employee.name.toLowerCase().includes(lowerSearchTerm) ||
    (employee.jobTitle?.toLowerCase().includes(lowerSearchTerm) ?? false) ||
    (employee.nickname?.toLowerCase().includes(lowerSearchTerm) ?? false)
  )
}

export function getData({
  start,
  limit,
  sortColumn,
  sortDirection = 'asc',
  searchTerm
}: GetDataParams): { data: Employee[], total: number } {
  let result = [...dummyData]

  // Apply search filter if searchTerm is provided
  if (searchTerm) {
    result = filterData(result, searchTerm)
  }

  // Apply sorting if sortColumn is provided
  if (sortColumn) {
    result = sortData(result, sortColumn, sortDirection)
  }

  // Get total count before pagination
  const total = result.length

  // Apply pagination
  result = result.slice(start, start + limit)

  return {
    data: result,
    total
  }
}

interface UpdateParams {
  rowIndex: number
  column: UpdatableColumn
  value: string | number | undefined
}

export function updateData({ rowIndex, column, value }: UpdateParams): Employee[] {
  // Create a new array to maintain immutability
  const updatedData = [...dummyData]
  
  // Validate row index
  if (rowIndex < 0 || rowIndex >= updatedData.length) {
    throw new Error('Invalid row index')
  }

  // Get the employee to update
  const employeeToUpdate = { ...updatedData[rowIndex] }

  // Type-safe update based on column type
  switch (column) {
    case 'name':
      if (typeof value !== 'string') {
        throw new Error('Name must be a string')
      }
      employeeToUpdate.name = value
      break
    case 'jobTitle':
      if (value !== undefined && typeof value !== 'string') {
        throw new Error('Job title must be a string or undefined')
      }
      employeeToUpdate.jobTitle = value as string | undefined
      break
    case 'age':
      if (typeof value !== 'number') {
        throw new Error('Age must be a number')
      }
      employeeToUpdate.age = value
      break
    case 'nickname':
      if (value !== undefined && typeof value !== 'string') {
        throw new Error('Nickname must be a string or undefined')
      }
      employeeToUpdate.nickname = value as string | undefined
      break
    default:
      throw new Error(`Invalid column: ${column}`)
  }

  // Update the data
  updatedData[rowIndex] = employeeToUpdate

  return updatedData
}

export default dummyData

