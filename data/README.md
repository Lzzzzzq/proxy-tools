hosts 文件为所有 host 的存储文件，key 为创建该条 host 时的时间戳取 md5

hosts_index 文件为所有 host 的索引文件，key 为 address+ip 取 md5，value 为 hosts 文件中的 key