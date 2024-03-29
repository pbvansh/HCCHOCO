import { v4 as uuid4, v5 as uuid5 } from 'uuid'

export default (namespaceString = '') =>
  namespaceString ? uuid5(namespaceString, uuid5.DNS) : uuid4()
