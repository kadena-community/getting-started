(namespace 'free)
(module hello-world G
  (defcap G () true)

	(defschema hello-world-schema
		@doc "The schema for hello world"

		text:string)

	(deftable hello-world-table:{hello-world-schema})

  (defun say-hello(name:string)
    (format "Hello, {}!" [name]))

	(defun write-hello(name:string)
		(write hello-world-table name
			{ "text": (say-hello name) }))

)

(create-table hello-world-table)